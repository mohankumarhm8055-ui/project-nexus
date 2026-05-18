'use strict';

const AIAnalytics = require('../models/AIAnalytics');
const Student = require('../models/Student');
const attendanceService = require('../services/attendance.service');
const marksService = require('../services/marks.service');
const { calcRiskScore } = require('../helpers/riskScoreCalc');
const cache = require('../services/cache.service');
const logger = require('../config/logger');

class RiskPredictor {
  /**
   * Analyze a single student and update/create their AIAnalytics document.
   */
  async analyzeStudent(studentId) {
    try {
      const student = await Student.findById(studentId).lean();
      if (!student) return null;

      // Fetch current analytics to get previous marks for trend
      const existing = await AIAnalytics.findOne({ student: studentId }).lean();
      const previousMarksPct = existing?.marksTrend?.currentAvg || null;

      // Fetch data
      const [attendanceSummary, marksSummary] = await Promise.all([
        attendanceService.getStudentAttendanceSummary(studentId),
        marksService.getStudentMarksSummary(studentId),
      ]);

      // Detect consecutive absences
      const consecutiveAbsences = await this._getConsecutiveAbsences(studentId);

      // Compute risk
      const risk = calcRiskScore({
        attendanceSummary,
        marksSummary,
        consecutiveAbsences,
        previousMarksPct,
      });

      // Build trend data
      const currentAttPct = attendanceSummary.overall.percentage;
      const lastMonthAtt = existing?.attendanceTrend?.current ?? currentAttPct;
      const currentMarksPct = marksSummary.overallPercentage;

      // Upsert AI analytics
      const analytics = await AIAnalytics.findOneAndUpdate(
        { student: studentId },
        {
          student: studentId,
          riskScore: risk.riskScore,
          riskLevel: risk.riskLevel,
          riskReasons: risk.riskReasons,
          performanceTrend: risk.performanceTrend,
          attendanceTrend: {
            current: currentAttPct,
            lastMonth: lastMonthAtt,
            change: +(currentAttPct - lastMonthAtt).toFixed(2),
          },
          marksTrend: {
            currentAvg: currentMarksPct,
            previousAvg: previousMarksPct || currentMarksPct,
            change: previousMarksPct ? +(currentMarksPct - previousMarksPct).toFixed(2) : 0,
          },
          consecutiveAbsences,
          suggestions: risk.suggestions,
          parentFriendlySummary: this._buildParentSummary(student, risk, currentAttPct, currentMarksPct),
          hodAlert: risk.hodAlert,
          detentionRisk: risk.detentionRisk,
          lastAnalyzedAt: new Date(),
          $push: {
            history: {
              $each: [{ riskScore: risk.riskScore, riskLevel: risk.riskLevel }],
              $slice: -30, // Keep last 30 snapshots
            },
          },
        },
        { upsert: true, new: true }
      );

      // Invalidate cache
      cache.del(cache.keys.aiAnalytics(studentId));

      return analytics;
    } catch (err) {
      logger.error(`Risk analysis failed for student ${studentId}: ${err.message}`);
      throw err;
    }
  }

  /**
   * Analyze all students in a department.
   */
  async analyzeDepartment(departmentId) {
    const students = await Student.find({ department: departmentId, isActive: true }).lean();
    logger.info(`AI Engine: Analyzing ${students.length} students in dept ${departmentId}`);

    const results = await Promise.allSettled(
      students.map((s) => this.analyzeStudent(s._id.toString()))
    );

    const success = results.filter((r) => r.status === 'fulfilled').length;
    const failed = results.filter((r) => r.status === 'rejected').length;
    logger.info(`AI Analysis complete: ${success} success, ${failed} failed`);
    return { total: students.length, success, failed };
  }

  /**
   * Get consecutive absence streak for a student.
   */
  async _getConsecutiveAbsences(studentId) {
    const Attendance = require('../models/Attendance');
    const recentRecords = await Attendance.find({ student: studentId })
      .sort({ date: -1 })
      .limit(30)
      .lean();

    let streak = 0;
    for (const rec of recentRecords) {
      if (rec.status === 'absent') streak++;
      else break;
    }
    return streak;
  }

  /**
   * Build a human-readable summary for parents.
   */
  _buildParentSummary(student, risk, attPct, marksPct) {
    const level = risk.riskLevel;
    const name = student.name.split(' ')[0];

    if (level === 'critical' || level === 'high') {
      return `${name} requires immediate attention. Their attendance is at ${attPct.toFixed(1)}% and academic performance shows concerns. We strongly recommend scheduling a meeting with their faculty advisor.`;
    }
    if (level === 'medium') {
      return `${name} is showing some areas that need improvement. Attendance is ${attPct.toFixed(1)}% and internal marks average is ${marksPct.toFixed(1)}%. Encourage consistent attendance and study habits.`;
    }
    return `${name} is performing well. Attendance stands at ${attPct.toFixed(1)}% and academic performance looks good. Keep up the great work!`;
  }
}

module.exports = new RiskPredictor();
