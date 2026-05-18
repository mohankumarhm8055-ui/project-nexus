'use strict';

const Marks = require('../models/Marks');
const Student = require('../models/Student');
const ApiError = require('../utils/ApiError');
const { calcGrade, calcTotalInternal } = require('../helpers/gradeCalc');
const cache = require('./cache.service');
const notificationService = require('./notification.service');
const logger = require('../config/logger');

class MarksService {
  // ── Upload bulk marks for a subject/type ──────────────────────────────────
  async uploadMarks({ subject, department, faculty, semester, academicYear, type, maxMarks, records }) {
    const results = { saved: 0, errors: [] };
    const lowMarksStudentIds = [];

    const ops = records.map(async (record) => {
      try {
        if (record.marks > maxMarks) {
          results.errors.push({ studentId: record.studentId, error: `Marks ${record.marks} exceed max ${maxMarks}` });
          return;
        }

        await Marks.findOneAndUpdate(
          { student: record.studentId, subject, type, semester, academicYear },
          { student: record.studentId, subject, faculty, department, type, marks: record.marks, maxMarks, semester, academicYear, remarks: record.remarks },
          { upsert: true, new: true, setDefaultsOnInsert: true }
        );
        results.saved++;

        // Flag low marks (< 40%)
        if ((record.marks / maxMarks) * 100 < 40) {
          lowMarksStudentIds.push(record.studentId);
        }
      } catch (err) {
        results.errors.push({ studentId: record.studentId, error: err.message });
      }
    });

    await Promise.allSettled(ops);

    // Invalidate cache
    await Promise.all(records.map((r) => cache.del(`marks:${r.studentId}:summary`)));

    // Queue parent notifications for low-performing students
    if (lowMarksStudentIds.length > 0) {
      setImmediate(() =>
        notificationService.sendLowMarksAlert(lowMarksStudentIds, { subject, type, maxMarks }).catch(
          (e) => logger.warn(`Low marks alert failed: ${e.message}`)
        )
      );
    }

    return results;
  }

  // ── Get all marks for a student in a semester ─────────────────────────────
  async getStudentMarksSummary(studentId, { semester, academicYear } = {}) {
    const cacheKey = `marks:${studentId}:summary`;
    return cache.getOrSet(cacheKey, async () => {
      const filter = { student: studentId };
      if (semester) filter.semester = semester;
      if (academicYear) filter.academicYear = academicYear;

      const marks = await Marks.find(filter)
        .populate('subject', 'name code maxInternalMarks')
        .sort({ createdAt: -1 })
        .lean();

      return this._buildMarksSummary(marks);
    }, 180);
  }

  // ── Publish marks (make visible to students) ──────────────────────────────
  async publishMarks(marksIds, publishedBy) {
    const result = await Marks.updateMany(
      { _id: { $in: marksIds }, isPublished: false },
      { isPublished: true, publishedAt: new Date() }
    );
    logger.info(`Marks published: ${result.modifiedCount} records by ${publishedBy}`);
    return result;
  }

  // ── Update single mark entry ──────────────────────────────────────────────
  async updateMark(marksId, { marks, remarks }, updatedBy) {
    const mark = await Marks.findById(marksId);
    if (!mark) throw ApiError.notFound('Marks record not found');
    if (marks > mark.maxMarks) throw ApiError.badRequest(`Marks cannot exceed ${mark.maxMarks}`);

    mark.marks = marks;
    if (remarks) mark.remarks = remarks;
    await mark.save();

    cache.del(`marks:${mark.student}:summary`);
    return mark;
  }

  // ── Build structured marks summary grouped by subject ────────────────────
  _buildMarksSummary(marks) {
    const bySubject = {};
    for (const m of marks) {
      const subId = m.subject?._id?.toString() || m.subject;
      if (!bySubject[subId]) {
        bySubject[subId] = {
          subject: m.subject,
          entries: [],
          total: 0,
          maxTotal: 0,
          percentage: 0,
          grade: 'F',
        };
      }
      bySubject[subId].entries.push({
        type: m.type,
        marks: m.marks,
        maxMarks: m.maxMarks,
        percentage: +((m.marks / m.maxMarks) * 100).toFixed(2),
        isPublished: m.isPublished,
        publishedAt: m.publishedAt,
      });
    }

    // Calculate totals per subject
    for (const key of Object.keys(bySubject)) {
      const sub = bySubject[key];
      const { total, maxTotal } = calcTotalInternal(sub.entries);
      sub.total = total;
      sub.maxTotal = maxTotal;
      sub.percentage = maxTotal > 0 ? +((total / maxTotal) * 100).toFixed(2) : 0;
      sub.grade = calcGrade(sub.percentage);
    }

    return {
      subjects: Object.values(bySubject),
      overallPercentage: this._calcOverall(Object.values(bySubject)),
    };
  }

  _calcOverall(subjects) {
    if (!subjects.length) return 0;
    const total = subjects.reduce((s, sub) => s + sub.percentage, 0);
    return +(total / subjects.length).toFixed(2);
  }
}

module.exports = new MarksService();
