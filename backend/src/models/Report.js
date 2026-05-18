'use strict';

const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ['student_report_card', 'attendance_report', 'department_analytics', 'placement_report', 'faculty_report'],
      required: true,
    },
    generatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    referenceId: { type: mongoose.Schema.Types.ObjectId }, // Student/Dept/Faculty ID
    referenceModel: { type: String }, // 'Student', 'Department', 'Faculty'
    title: { type: String, required: true },
    format: { type: String, enum: ['pdf', 'excel', 'csv'], default: 'pdf' },
    fileUrl: { type: String },
    fileSize: { type: Number }, // bytes
    parameters: { type: mongoose.Schema.Types.Mixed }, // Query params used
    status: {
      type: String,
      enum: ['queued', 'generating', 'completed', 'failed'],
      default: 'queued',
    },
    errorMessage: { type: String },
    generatedAt: { type: Date },
    expiresAt: { type: Date }, // Auto-delete report files after expiry
  },
  { timestamps: true }
);

reportSchema.index({ generatedBy: 1, createdAt: -1 });
reportSchema.index({ type: 1, status: 1 });
reportSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

module.exports = mongoose.model('Report', reportSchema);
