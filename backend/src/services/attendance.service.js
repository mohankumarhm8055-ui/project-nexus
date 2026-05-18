'use strict';

const Attendance = require('../models/Attendance');
const Student = require('../models/Student');
const ApiError = require('../utils/ApiError');
const { calcAttendancePercent, detectLowAttendance } = require('../helpers/attendanceCalc');
const notificationService = require('./notification.service');
const cache = require('./cache.service');
const logger = require('../config/logger');
const dayjs = require('dayjs');

class AttendanceService {
  // ── Mark bulk attendance for a class session ───────────────────────────────
  async markBulkAttendance({ department, subject, faculty, semester, section, academicYear, date, period, records }) {
    const sessionDate = dayjs(date).startOf('day').toDate();
    const results = { saved: 0, skipped: 0, errors: [] };
    const absentStudentIds = [];

    const ops = records.map(async (record) => {
      try {
        const doc = await Attendance.findOneAndUpdate(
          { student: record.studentId, subject, date: sessionDate, ...(period && { period }) },
          {
            student: record.studentId,
            subject,
            faculty,
            department,
            date: sessionDate,
            status: record.status,
            semester,
            section,
            academicYear,
            period,
            remarks: record.remarks,
          },
          { upsert: true, new: true, setDefaultsOnInsert: true }
        );
        results.saved++;
        if (record.status === 'absent') absentStudentIds.push(record.studentId);
      } catch (err) {
        if (err.code === 11000) {
          results.skipped++;
        } else {
          results.errors.push({ studentId: record.studentId, error: err.message });
        }
      }
    });

    await Promise.allSettled(ops);

    // Invalidate attendance cache for all affected students
    await Promise.all(records.map((r) => cache.del(cache.keys.attendanceSummary(r.studentId))));
    cache.invalidatePattern(`hod:${department}:*`);

    // Queue parent alerts for absent students (non-blocking)
    if (absentStudentIds.length > 0) {
      setImmediate(() => this._notifyParentsForAbsent(absentStudentIds, { subject, date: sessionDate }).catch(
        (e) => logger.warn(`Parent alert failed: ${e.message}`)
      ));
    }

    return results;
  }

  // ── Get student attendance summary ─────────────────────────────────────────
  async getStudentAttendanceSummary(studentId, { semester, academicYear } = {}) {
    const cacheKey = cache.keys.attendanceSummary(studentId);
    return cache.getOrSet(cacheKey, async () => {
      const match = { student: studentId };
      if (semester) match.semester = semester;
      if (academicYear) match.academicYear = academicYear;

      const records = await Attendance.find(match)
        .populate('subject', 'name code credits')
        .sort({ date: -1 })
        .lean();

      return calcAttendancePercent(records);
    }, 120); // 2 min cache
  }

  // ── Get attendance for a whole department / class ──────────────────────────
  async getDepartmentAttendance(departmentId, { semester, section, date, academicYear }) {
    const match = { department: departmentId };
    if (semester) match.semester = semester;
    if (section) match.section = section;
    if (date) {
      const d = dayjs(date);
      match.date = { $gte: d.startOf('day').toDate(), $lte: d.endOf('day').toDate() };
    }
    if (academicYear) match.academicYear = academicYear;

    return Attendance.find(match)
      .populate('student', 'name usn')
      .populate('subject', 'name code')
      .sort({ date: -1 })
      .lean();
  }

  // ── Students with attendance < threshold ──────────────────────────────────
  async getLowAttendanceStudents(departmentId, threshold = 75) {
    const students = await Student.find({ department: departmentId, isActive: true }).lean();
    const analyses = await Promise.all(
      students.map(async (s) => {
        const summary = await this.getStudentAttendanceSummary(s._id.toString());
        const overall = summary.overall?.percentage ?? 100;
        return { student: s, overall, isLow: overall < threshold };
      })
    );
    return analyses.filter((a) => a.isLow).sort((a, b) => a.overall - b.overall);
  }

  // ── Notify parents for absent students ────────────────────────────────────
  async _notifyParentsForAbsent(studentIds, { subject, date }) {
    const students = await Student.find({ _id: { $in: studentIds } })
      .populate('parentId')
      .populate({ path: 'department', select: 'name' })
      .lean();

    for (const student of students) {
      if (!student.parentId) continue;
      await notificationService.sendParentAbsenceAlert(student, { subject, date });
    }
  }
}

module.exports = new AttendanceService();
