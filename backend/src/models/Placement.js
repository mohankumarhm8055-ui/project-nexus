'use strict';

const mongoose = require('mongoose');

const applicantSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
  appliedAt: { type: Date, default: Date.now },
  status: {
    type: String,
    enum: ['applied', 'shortlisted', 'interview', 'selected', 'rejected', 'withdrawn'],
    default: 'applied',
  },
  offerLetterUrl: { type: String },
  ctcOffered: { type: String },
  remarks: { type: String },
});

const placementDriveSchema = new mongoose.Schema(
  {
    company: {
      name: { type: String, required: true, trim: true },
      logo: { type: String },
      website: { type: String },
      industry: { type: String },
      description: { type: String },
    },
    role: { type: String, required: true, trim: true },
    ctcRange: {
      min: { type: Number },
      max: { type: Number },
    },
    ctcDisplay: { type: String }, // e.g. "6-12 LPA"
    eligibility: {
      minCGPA: { type: Number, default: 6.0 },
      allowedBranches: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Department' }],
      maxBacklogs: { type: Number, default: 0 },
      yearRequired: { type: Number }, // final year only
    },
    driveDate: { type: Date, required: true },
    lastApplyDate: { type: Date },
    location: { type: String },
    mode: { type: String, enum: ['online', 'offline', 'hybrid'], default: 'offline' },
    status: {
      type: String,
      enum: ['upcoming', 'ongoing', 'completed', 'cancelled'],
      default: 'upcoming',
    },
    jobDescription: { type: String },
    rounds: [{ type: String }], // e.g. ["Aptitude", "Technical", "HR"]
    applicants: [applicantSchema],
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

placementDriveSchema.index({ status: 1, driveDate: 1 });
placementDriveSchema.index({ 'eligibility.minCGPA': 1 });

module.exports = mongoose.model('PlacementDrive', placementDriveSchema);
