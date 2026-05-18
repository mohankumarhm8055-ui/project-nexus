'use strict';

const AuditLog = require('../models/AuditLog');
const logger = require('../config/logger');

/**
 * Records every mutating API call (POST/PUT/PATCH/DELETE) to the AuditLog collection.
 * Non-blocking — errors are swallowed to never affect the request.
 */
const auditLogger = (action, entity) => async (req, res, next) => {
  const startTime = Date.now();
  const originalSend = res.json.bind(res);

  res.json = function (body) {
    const responseTime = Date.now() - startTime;

    // Fire-and-forget
    setImmediate(async () => {
      try {
        // Sanitize payload — remove sensitive fields
        const safePayload = req.body ? { ...req.body } : {};
        delete safePayload.password;
        delete safePayload.passwordHash;
        delete safePayload.token;
        delete safePayload.refreshToken;

        await AuditLog.create({
          user: req.user?._id,
          userIdentifier: req.user?.email || req.user?.identifier,
          role: req.user?.role,
          action: action || `${req.method}_${req.route?.path || req.path}`,
          entity,
          entityId: req.params?.id || req.params?.studentId || req.params?.facultyId,
          method: req.method,
          route: req.originalUrl,
          ipAddress: req.ip || req.connection?.remoteAddress,
          userAgent: req.headers['user-agent'],
          statusCode: res.statusCode,
          payload: Object.keys(safePayload).length ? safePayload : undefined,
          responseTime,
          success: res.statusCode < 400,
        });
      } catch (err) {
        logger.warn(`Audit log failed: ${err.message}`);
      }
    });

    return originalSend(body);
  };

  next();
};

module.exports = { auditLogger };
