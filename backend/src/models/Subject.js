'use strict';

const mongoose = require('mongoose');

const subjectSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    code: { type: String, required: true, unique: true, uppercase: true, trim: true },
    credits: { type: Number, required: true, min: 1, max: 6 },
    department: { type: mongoose.Schema.Types.ObjectId, ref: 'Department', required: true },
    semester: { type: Number, required: true, min: 1, max: 8 },
    type: { type: String, enum: ['theory', 'lab', 'elective', 'project'], default: 'theory' },
    maxInternalMarks: { type: Number, default: 50 },
    maxExternalMarks: { type: Number, default: 100 },
    faculty: { type: mongoose.Schema.Types.ObjectId, ref: 'Faculty' },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

subjectSchema.index({ code: 1 });
subjectSchema.index({ department: 1, semester: 1 });

module.exports = mongoose.model('Subject', subjectSchema);
