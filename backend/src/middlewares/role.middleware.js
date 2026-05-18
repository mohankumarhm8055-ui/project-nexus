'use strict';

const ApiError = require('../utils/ApiError');

/**
 * Factory: returns middleware that checks req.user.role against allowed roles.
 * Usage: authorize('admin', 'hod')
 */
const authorize = (...roles) => (req, res, next) => {
  if (!req.user) {
    return next(ApiError.unauthorized('Authentication required'));
  }
  if (!roles.includes(req.user.role)) {
    return next(
      ApiError.forbidden(
        `Access denied. Required roles: [${roles.join(', ')}]. Your role: ${req.user.role}`
      )
    );
  }
  next();
};

/**
 * Allows the resource owner OR privileged roles.
 * Usage: authorizeOwnerOrRoles('id', 'admin', 'hod')
 * Where 'id' is the param name containing the resource owner's userId.
 */
const authorizeOwnerOrRoles = (paramName, ...roles) => (req, res, next) => {
  if (!req.user) return next(ApiError.unauthorized());
  const isOwner = req.params[paramName] === req.user.id.toString();
  const isPrivileged = roles.includes(req.user.role);
  if (!isOwner && !isPrivileged) return next(ApiError.forbidden());
  next();
};

module.exports = { authorize, authorizeOwnerOrRoles };
