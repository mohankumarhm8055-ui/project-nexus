'use strict';

/**
 * Rule-based AI Risk Score Calculator.
 * Produces a 0–100 risk score for a student based on academic indicators.
 *
 * Risk factors and weights:
 * - Overall attendance < 75%          → up to 30 pts
 * - Subject-level low attendance       → up to 15 pts
 * - Internal marks avg < 50%          → up to 25 pts
 * - Consecutive absences > 3          → up to 15 pts
 * - Performance declining trend       → 10 pts
 * - Subjects with F grade             → 5 pts each (max 5 pts)
 */

const WEIGHTS = {
  overallAttendance: 30,
  subjectAttendance: 15,
  marksAvg: 25,
  consecutiveAbsences: 15,
  decliningTrend: 10,
  failedSubjects: 5,
};

const calcRiskScore = ({ attendanceSummary, marksSummary, consecutiveAbsences = 0, previousMarksPct = null }) => {
  let score = 0;
  const reasons = [];
  const suggestions = [];

  // ── 1. Overall Attendance ─────────────────────────────────────────────────
  const overallPct = attendanceSummary?.overall?.percentage ?? 100;
  if (overallPct < 65) {
    score += WEIGHTS.overallAttendance;
    reasons.push(`Critical attendance: ${overallPct.toFixed(1)}% (risk of detention)`);
    suggestions.push('Attend all remaining classes to avoid detention');
  } else if (overallPct < 75) {
    score += WEIGHTS.overallAttendance * 0.7;
    reasons.push(`Low overall attendance: ${overallPct.toFixed(1)}% (below 75% threshold)`);
    suggestions.push('Reduce absences — attendance is below the required 75%');
  } else if (overallPct < 85) {
    score += WEIGHTS.overallAttendance * 0.2;
    reasons.push(`Moderate attendance: ${overallPct.toFixed(1)}%`);
  }

  // ── 2. Subject-Level Low Attendance ──────────────────────────────────────
  const lowSubjects = (attendanceSummary?.subjects || []).filter((s) => s.percentage < 75);
  if (lowSubjects.length > 0) {
    const ratio = Math.min(lowSubjects.length / 3, 1);
    score += WEIGHTS.subjectAttendance * ratio;
    reasons.push(`${lowSubjects.length} subject(s) with attendance below 75%`);
    suggestions.push(`Focus on attendance in: ${lowSubjects.map((s) => s.subject?.name || 'N/A').join(', ')}`);
  }

  // ── 3. Internal Marks Average ─────────────────────────────────────────────
  const marksAvg = marksSummary?.overallPercentage ?? 100;
  if (marksAvg < 35) {
    score += WEIGHTS.marksAvg;
    reasons.push(`Very low internal marks average: ${marksAvg.toFixed(1)}%`);
    suggestions.push('Seek faculty guidance and additional study resources');
  } else if (marksAvg < 50) {
    score += WEIGHTS.marksAvg * 0.65;
    reasons.push(`Low marks average: ${marksAvg.toFixed(1)}%`);
    suggestions.push('Schedule extra study sessions and attend remedial classes');
  } else if (marksAvg < 60) {
    score += WEIGHTS.marksAvg * 0.25;
  }

  // ── 4. Consecutive Absences ───────────────────────────────────────────────
  if (consecutiveAbsences >= 7) {
    score += WEIGHTS.consecutiveAbsences;
    reasons.push(`${consecutiveAbsences} consecutive days absent — critical`);
    suggestions.push('Immediate intervention required — contact student and parents');
  } else if (consecutiveAbsences >= 4) {
    score += WEIGHTS.consecutiveAbsences * 0.6;
    reasons.push(`${consecutiveAbsences} consecutive days absent`);
    suggestions.push('Check on student wellbeing and reasons for absence');
  } else if (consecutiveAbsences >= 2) {
    score += WEIGHTS.consecutiveAbsences * 0.2;
  }

  // ── 5. Declining Performance Trend ───────────────────────────────────────
  if (previousMarksPct !== null && marksAvg < previousMarksPct - 10) {
    score += WEIGHTS.decliningTrend;
    reasons.push(`Performance declined by ${(previousMarksPct - marksAvg).toFixed(1)}% from last assessment`);
    suggestions.push('Review recent assessments and identify gaps in understanding');
  }

  // ── 6. Failed Subjects ────────────────────────────────────────────────────
  const failedSubjects = (marksSummary?.subjects || []).filter((s) => s.grade === 'F');
  if (failedSubjects.length > 0) {
    score += Math.min(failedSubjects.length * WEIGHTS.failedSubjects, WEIGHTS.failedSubjects);
    reasons.push(`${failedSubjects.length} subject(s) with failing grade`);
    suggestions.push('Prioritize improvement in failing subjects');
  }

  // ── Normalize to 0–100 ────────────────────────────────────────────────────
  score = Math.min(100, Math.round(score));

  const riskLevel =
    score >= 70 ? 'critical' :
    score >= 50 ? 'high' :
    score >= 30 ? 'medium' : 'low';

  const detentionRisk = overallPct < 65;
  const hodAlert = score >= 50;

  return {
    riskScore: score,
    riskLevel,
    riskReasons: reasons,
    suggestions,
    detentionRisk,
    hodAlert,
    performanceTrend: previousMarksPct !== null && marksAvg < previousMarksPct - 5
      ? 'declining'
      : marksAvg > (previousMarksPct || 0) + 5
        ? 'improving'
        : 'stable',
  };
};

module.exports = { calcRiskScore };
