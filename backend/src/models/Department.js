'use strict';

const mongoose = require('mongoose');

const departmentSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true, trim: true },
    code: { type: String, required: true, unique: true, uppercase: true, trim: true },
    hodId: { type: mongoose.Schema.Types.ObjectId, ref: 'Faculty' },
    totalStudents: { type: Number, default: 0 },
    totalFaculty: { type: Number, default: 0 },
    establishedYear: { type: Number },
    vision: { type: String },
    mission: { type: String },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

departmentSchema.index({ code: 1 });

module.exports = mongoose.model('Department', departmentSchema);
