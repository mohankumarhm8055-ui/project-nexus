'use strict';

const Attendance = require('../models/Attendance');
const dayjs = require('dayjs');

class AttendanceAnalyzer {
  /**
   * Generate a heatmap of attendance for a student over the past N days.
   */
  async getHeatmap(studentId, days = 30) {
    const from = dayjs().subtract(days, 'day').startOf('day').toDate();
    const to = new Date();

    const records = await Attendance.find({
      student: studentId,
      date: { $gte: from, $lte: to },
    }).lean();

    const recordMap = {};
    for (const rec of records) {
      const key = dayjs(rec.date).format('YYYY-MM-DD');
      if (!recordMap[key]) recordMap[key] = [];
      recordMap[key].push(rec.status);
    }

    const heatmap = [];
    for (let i = days - 1; i >= 0; i--) {
      const date = dayjs().subtract(i, 'day');
      const key = date.format('YYYY-MM-DD');
      const dayOfWeek = date.day();
      const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
      const statuses = recordMap[key] || [];
      const hasAbsent = statuses.some((s) => s === 'absent');
      const hasPresent = statuses.some((s) => s === 'present');

      let status = 'no_class';
      if (isWeekend) status = 'weekend';
      else if (hasAbsent && !hasPresent) status = 'absent';
      else if (hasPresent) status = 'present';
      else if (date.isAfter(dayjs())) status = 'future';

      heatmap.push({ date: key, status, count: statuses.length });
    }

    return heatmap;
  }

  /**
   * Get monthly trend (last 6 months).
   */
  async getMonthlyTrend(studentId) {
    const sixMonthsAgo = dayjs().subtract(6, 'month').startOf('month').toDate();
    const records = await Attendance.find({ student: studentId, date: { $gte: sixMonthsAgo } }).lean();

    const months = {};
    for (const rec of records) {
      const month = dayjs(rec.date).format('YYYY-MM');
      if (!months[month]) months[month] = { total: 0, present: 0, month };
      months[month].total++;
      if (rec.status === 'present') months[month].present++;
    }

    return Object.values(months)
      .sort((a, b) => a.month.localeCompare(b.month))
      .map((m) => ({
        ...m,
        percentage: m.total > 0 ? +((m.present / m.total) * 100).toFixed(2) : 0,
        label: dayjs(m.month).format('MMM YYYY'),
      }));
  }
}

module.exports = new AttendanceAnalyzer();
