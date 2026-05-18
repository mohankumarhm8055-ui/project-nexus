'use strict';

const mongoose = require('mongoose');

const aiAnalyticsSchema = new mongoose.Schema(
  {
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true, unique: true },
    riskScore: { type: Number, min: 0, max: 100, default: 0 },
    riskLevel: {
      type: String,
      enum: ['low', 'medium', 'high', 'critical'],
      default: 'low',
    },
    riskReasons: [{ type: String }],
    performanceTrend: {
      type: String,
      enum: ['improving', 'stable', 'declining', 'critical'],
      default: 'stable',
    },
    attendanceTrend: {
      current: { type: Number, default: 0 },
      lastMonth: { type: Number, default: 0 },
      change: { type: Number, default: 0 },
    },
    marksTrend: {
      currentAvg: { type: Number, default: 0 },
      previousAvg: { type: Number, default: 0 },
      change: { type: Number, default: 0 },
    },
    consecutiveAbsences: { type: Number, default: 0 },
    subjectsAtRisk: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Subject' }],
    suggestions: [{ type: String }],
    parentFriendlySummary: { type: String },
    hodAlert: { type: Boolean, default: false },
    detentionRisk: { type: Boolean, default: false },
    lastAnalyzedAt: { type: Date, default: Date.now },
    // Historical snapshots
    history: [
      {
        riskScore: Number,
        riskLevel: String,
        recordedAt: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

aiAnalyticsSchema.index({ student: 1 });
aiAnalyticsSchema.index({ riskLevel: 1, hodAlert: 1 });
aiAnalyticsSchema.index({ detentionRisk: 1 });

module.exports = mongoose.model('AIAnalytics', aiAnalyticsSchema);
