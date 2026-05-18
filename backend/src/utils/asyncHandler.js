'use strict';

/**
 * Wraps async route handlers to eliminate try/catch boilerplate.
 * Forwards any thrown error to Express error middleware.
 */
const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

module.exports = asyncHandler;
