'use strict';

const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema(
  {
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
    subject: { type: mongoose.Schema.Types.ObjectId, ref: 'Subject', required: true },
    faculty: { type: mongoose.Schema.Types.ObjectId, ref: 'Faculty', required: true },
    department: { type: mongoose.Schema.Types.ObjectId, ref: 'Department', required: true },
    date: { type: Date, required: true },
    status: {
      type: String,
      enum: ['present', 'absent', 'late', 'excused'],
      required: true,
      default: 'present',
    },
    semester: { type: Number, required: true },
    section: { type: String, required: true, uppercase: true },
    academicYear: { type: String, required: true }, // e.g. "2024-25"
    period: { type: Number, min: 1, max: 8 }, // class period number
    remarks: { type: String, maxlength: 200 },
    // Parent notification tracking
    parentNotified: { type: Boolean, default: false },
    parentNotifiedAt: { type: Date },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
  }
);

// ── Compound indexes for efficient queries ───────────────────────────────────
attendanceSchema.index({ student: 1, subject: 1, date: 1 }, { unique: true });
attendanceSchema.index({ student: 1, date: 1 });
attendanceSchema.index({ subject: 1, date: 1 });
attendanceSchema.index({ faculty: 1, date: 1 });
attendanceSchema.index({ department: 1, semester: 1, section: 1, date: 1 });
attendanceSchema.index({ date: -1, status: 1 });

// ── Prevent duplicate attendance for same class ──────────────────────────────
attendanceSchema.index(
  { student: 1, subject: 1, date: 1, period: 1 },
  { unique: true, sparse: true }
);

module.exports = mongoose.model('Attendance', attendanceSchema);
