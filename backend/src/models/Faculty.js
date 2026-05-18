'use strict';

const mongoose = require('mongoose');

const facultySchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    employeeId: { type: String, required: true, unique: true, uppercase: true, trim: true },
    name: { type: String, required: true, trim: true },
    department: { type: mongoose.Schema.Types.ObjectId, ref: 'Department', required: true },
    designation: {
      type: String,
      enum: ['Assistant Professor', 'Associate Professor', 'Professor', 'HOD', 'Lecturer', 'Lab Instructor'],
      default: 'Assistant Professor',
    },
    subjects: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Subject' }],
    qualifications: [{ type: String }],
    specialization: { type: String },
    experience: { type: Number, default: 0 }, // years
    joiningDate: { type: Date },
    phone: { type: String },
    profilePic: { type: String, default: null },
    isActive: { type: Boolean, default: true },
    deletedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

facultySchema.index({ employeeId: 1 });
facultySchema.index({ department: 1, isActive: 1 });
facultySchema.pre(/^find/, function (next) {
  if (!this.getOptions().includeSoftDeleted) this.where({ deletedAt: null });
  next();
});

module.exports = mongoose.model('Faculty', facultySchema);
