'use strict';

const mongoose = require('mongoose');

const auditLogSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    userIdentifier: { type: String }, // email or USN, even if user deleted
    role: { type: String },
    action: { type: String, required: true }, // e.g. "MARK_ATTENDANCE", "LOGIN"
    entity: { type: String }, // e.g. "Attendance", "User"
    entityId: { type: mongoose.Schema.Types.ObjectId },
    method: { type: String, enum: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'] },
    route: { type: String },
    ipAddress: { type: String },
    userAgent: { type: String },
    statusCode: { type: Number },
    payload: { type: mongoose.Schema.Types.Mixed }, // Sanitized request body
    responseTime: { type: Number }, // ms
    success: { type: Boolean, default: true },
    errorMessage: { type: String },
  },
  {
    timestamps: true,
    // Capped collection alternative: TTL index — auto-delete after 90 days
  }
);

// TTL: auto-expire audit logs after 90 days (to manage storage)
auditLogSchema.index({ createdAt: 1 }, { expireAfterSeconds: 7776000 }); // 90 days
auditLogSchema.index({ user: 1, createdAt: -1 });
auditLogSchema.index({ action: 1, entity: 1 });
auditLogSchema.index({ ipAddress: 1, createdAt: -1 });

module.exports = mongoose.model('AuditLog', auditLogSchema);
