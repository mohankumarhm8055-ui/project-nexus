'use strict';

/**
 * Performance Advisor — generates personalized recommendations
 * based on student academic profile.
 */
class PerformanceAdvisor {
  /**
   * Generate subject-specific recommendations.
   */
  getSubjectRecommendations(subjects) {
    return subjects.map((sub) => {
      const pct = sub.percentage;
      let recommendation = '';
      let priority = 'low';

      if (pct < 40) {
        recommendation = `Critical: Immediate remedial action needed in ${sub.subject?.name}. Schedule one-on-one faculty sessions.`;
        priority = 'critical';
      } else if (pct < 55) {
        recommendation = `${sub.subject?.name} needs attention. Focus on past papers and concept revision.`;
        priority = 'high';
      } else if (pct < 70) {
        recommendation = `Strengthen fundamentals in ${sub.subject?.name} to improve performance.`;
        priority = 'medium';
      } else if (pct < 85) {
        recommendation = `Good progress in ${sub.subject?.name}. Aim for excellence with regular practice.`;
        priority = 'low';
      } else {
        recommendation = `Excellent performance in ${sub.subject?.name}. Maintain consistency.`;
        priority = 'none';
      }

      return { subject: sub.subject, percentage: pct, grade: sub.grade, recommendation, priority };
    });
  }

  /**
   * Overall performance message.
   */
  getOverallAdvice(riskLevel, overallPct, marksPct) {
    const messages = {
      critical: `Your academic standing requires urgent action. Attendance (${overallPct?.toFixed(1)}%) and marks (${marksPct?.toFixed(1)}%) are critically low. Please meet your HOD immediately.`,
      high: `You're at high academic risk. Focus on increasing attendance above 75% and scoring above 50% in internals. Talk to your faculty advisor this week.`,
      medium: `Your academic performance has room for improvement. Build a consistent study schedule and don't miss classes.`,
      low: `You're on a good academic track. Keep maintaining your attendance and performance standards.`,
    };
    return messages[riskLevel] || messages.low;
  }

  /**
   * Generate a study plan outline.
   */
  generateStudyPlan(weakSubjects) {
    if (!weakSubjects.length) return 'No weak subjects identified. Maintain your current study routine!';
    const slots = weakSubjects.slice(0, 3).map((s, i) => {
      const days = ['Monday', 'Wednesday', 'Friday'];
      return `• ${days[i] || 'Daily'}: Focus on ${s.subject?.name || 'N/A'} — ${s.percentage < 50 ? '2 hours revision + faculty help' : '1 hour self-study'}`;
    });
    return `Recommended study plan:\n${slots.join('\n')}`;
  }
}

module.exports = new PerformanceAdvisor();
