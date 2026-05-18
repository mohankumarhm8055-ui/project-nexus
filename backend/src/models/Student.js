'use strict';

const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    usn: {
      type: String,
      required: [true, 'USN is required'],
      unique: true,
      uppercase: true,
      trim: true,
    },
    name: { type: String, required: true, trim: true },
    dob: { type: Date },
    gender: { type: String, enum: ['male', 'female', 'other'] },
    phone: { type: String, trim: true },
    address: { type: String },
    department: { type: mongoose.Schema.Types.ObjectId, ref: 'Department', required: true },
    semester: { type: Number, required: true, min: 1, max: 8 },
    section: { type: String, uppercase: true, trim: true, default: 'A' },
    year: { type: Number, required: true, min: 1, max: 4 },
    cgpa: { type: Number, default: 0, min: 0, max: 10 },
    parentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Parent' },
    profilePic: { type: String, default: null },
    skills: [{ type: String, trim: true }],
    documents: [
      {
        name: String,
        url: String,
        type: String,
        uploadedAt: { type: Date, default: Date.now },
      },
    ],
    admissionYear: { type: Number },
    passoutYear: { type: Number },
    isActive: { type: Boolean, default: true },
    deletedAt: { type: Date, default: null },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// ── Indexes ──────────────────────────────────────────────────────────────────
studentSchema.index({ usn: 1 });
studentSchema.index({ department: 1, semester: 1, section: 1 });
studentSchema.index({ year: 1, isActive: 1 });
studentSchema.index({ parentId: 1 });
studentSchema.index({ deletedAt: 1 });

// ── Soft delete query filter ─────────────────────────────────────────────────
studentSchema.pre(/^find/, function (next) {
  if (!this.getOptions().includeSoftDeleted) this.where({ deletedAt: null });
  next();
});

module.exports = mongoose.model('Student', studentSchema);
