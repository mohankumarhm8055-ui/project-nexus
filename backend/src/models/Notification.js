'use strict';

const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema(
  {
    recipient: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    recipientRole: { type: String, required: true },
    sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    senderRole: { type: String },
    channel: {
      type: String,
      enum: ['sms', 'whatsapp', 'email', 'push', 'in_app'],
      required: true,
    },
    title: { type: String, required: true, maxlength: 200 },
    body: { type: String, required: true, maxlength: 1000 },
    category: {
      type: String,
      enum: ['attendance', 'marks', 'fee', 'general', 'emergency', 'placement', 'system'],
      default: 'general',
    },
    status: {
      type: String,
      enum: ['pending', 'sent', 'delivered', 'failed', 'read'],
      default: 'pending',
    },
    isRead: { type: Boolean, default: false },
    readAt: { type: Date },
    deliveredAt: { type: Date },
    failureReason: { type: String },
    retryCount: { type: Number, default: 0, max: 3 },
    scheduledFor: { type: Date },
    metadata: { type: mongoose.Schema.Types.Mixed }, // Extra payload
  },
  {
    timestamps: true,
  }
);

notificationSchema.index({ recipient: 1, isRead: 1, createdAt: -1 });
notificationSchema.index({ status: 1, scheduledFor: 1 });
notificationSchema.index({ category: 1, createdAt: -1 });
notificationSchema.index({ retryCount: 1, status: 1 });

module.exports = mongoose.model('Notification', notificationSchema);
