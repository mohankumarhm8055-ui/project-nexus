'use strict';

/**
 * Calculates per-subject and overall attendance percentage
 * from a flat array of attendance records.
 */
const calcAttendancePercent = (records) => {
  const bySubject = {};

  for (const rec of records) {
    const subId = rec.subject?._id?.toString() || rec.subject?.toString();
    if (!subId) continue;

    if (!bySubject[subId]) {
      bySubject[subId] = {
        subject: rec.subject,
        total: 0,
        present: 0,
        absent: 0,
        late: 0,
        excused: 0,
        percentage: 0,
        isLow: false,
        dates: [],
      };
    }

    bySubject[subId].total++;
    bySubject[subId][rec.status] = (bySubject[subId][rec.status] || 0) + 1;
    bySubject[subId].dates.push({ date: rec.date, status: rec.status });
  }

  // Compute percentages and low-attendance flags
  for (const key of Object.keys(bySubject)) {
    const sub = bySubject[key];
    sub.percentage = sub.total > 0
      ? parseFloat(((sub.present / sub.total) * 100).toFixed(2))
      : 0;
    sub.isLow = sub.percentage < 75;
  }

  const subjects = Object.values(bySubject);
  const totalClasses = subjects.reduce((s, sub) => s + sub.total, 0);
  const totalPresent = subjects.reduce((s, sub) => s + sub.present, 0);
  const overallPercentage = totalClasses > 0
    ? parseFloat(((totalPresent / totalClasses) * 100).toFixed(2))
    : 0;

  return {
    subjects,
    overall: {
      totalClasses,
      totalPresent,
      totalAbsent: totalClasses - totalPresent,
      percentage: overallPercentage,
      isLow: overallPercentage < 75,
      detentionRisk: overallPercentage < 65,
    },
  };
};

/**
 * Detects low attendance subjects below threshold.
 */
const detectLowAttendance = (summary, threshold = 75) => {
  return summary.subjects.filter((s) => s.percentage < threshold);
};

/**
 * Calculates classes needed to reach target attendance.
 */
const classesNeededToReach = (present, total, target = 75) => {
  // Solve: (present + x) / (total + x) >= target/100
  if ((present / total) * 100 >= target) return 0;
  const x = Math.ceil((target * total - 100 * present) / (100 - target));
  return Math.max(0, x);
};

/**
 * Calculates how many more classes can be missed while staying above threshold.
 */
const classesCanMiss = (present, total, threshold = 75) => {
  // Solve: present / (total + x) >= threshold/100
  const maxAbsent = Math.floor((present * 100 - threshold * total) / threshold);
  return Math.max(0, maxAbsent);
};

module.exports = { calcAttendancePercent, detectLowAttendance, classesNeededToReach, classesCanMiss };
