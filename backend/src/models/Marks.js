'use strict';

const mongoose = require('mongoose');

const marksSchema = new mongoose.Schema(
  {
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
    subject: { type: mongoose.Schema.Types.ObjectId, ref: 'Subject', required: true },
    faculty: { type: mongoose.Schema.Types.ObjectId, ref: 'Faculty', required: true },
    department: { type: mongoose.Schema.Types.ObjectId, ref: 'Department', required: true },
    type: {
      type: String,
      enum: ['internal1', 'internal2', 'internal3', 'lab', 'assignment', 'quiz', 'project', 'external'],
      required: true,
    },
    marks: {
      type: Number,
      required: true,
      min: [0, 'Marks cannot be negative'],
    },
    maxMarks: {
      type: Number,
      required: true,
      min: [1, 'Max marks must be at least 1'],
    },
    semester: { type: Number, required: true },
    academicYear: { type: String, required: true },
    isPublished: { type: Boolean, default: false },
    publishedAt: { type: Date },
    remarks: { type: String, maxlength: 300 },
    // Parent notification
    parentNotified: { type: Boolean, default: false },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
  }
);

// ── Virtual: percentage ──────────────────────────────────────────────────────
marksSchema.virtual('percentage').get(function () {
  return parseFloat(((this.marks / this.maxMarks) * 100).toFixed(2));
});

// ── Validate marks <= maxMarks ───────────────────────────────────────────────
marksSchema.pre('save', function (next) {
  if (this.marks > this.maxMarks) {
    next(new Error(`Marks (${this.marks}) cannot exceed maxMarks (${this.maxMarks})`));
  } else {
    next();
  }
});

// ── Indexes ──────────────────────────────────────────────────────────────────
marksSchema.index({ student: 1, subject: 1, type: 1, semester: 1 });
marksSchema.index({ student: 1, semester: 1 });
marksSchema.index({ subject: 1, type: 1 });
marksSchema.index({ faculty: 1, semester: 1 });
marksSchema.index({ department: 1, semester: 1, isPublished: 1 });

module.exports = mongoose.model('Marks', marksSchema);
