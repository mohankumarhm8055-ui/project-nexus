'use strict';

const mongoose = require('mongoose');

const parentSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    name: { type: String, required: true, trim: true },
    relationship: {
      type: String,
      enum: ['father', 'mother', 'guardian', 'other'],
      default: 'father',
    },
    phone: { type: String, required: true, trim: true },
    whatsappPhone: { type: String, trim: true },
    email: { type: String, lowercase: true, trim: true },
    occupation: { type: String },
    address: { type: String },
    // A parent can have multiple children
    students: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Student' }],
    preferredNotification: {
      type: [String],
      enum: ['sms', 'whatsapp', 'email', 'push'],
      default: ['sms', 'email'],
    },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

parentSchema.index({ phone: 1 });
parentSchema.index({ students: 1 });

module.exports = mongoose.model('Parent', parentSchema);
