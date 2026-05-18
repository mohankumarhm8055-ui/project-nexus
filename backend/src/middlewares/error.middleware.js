'use strict';

const logger = require('../config/logger');
const ApiError = require('../utils/ApiError');

/**
 * Global Express error handler — must have 4 args.
 * Distinguishes operational errors (ApiError) from programming errors.
 */
// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
  let error = err;

  // ── Mongoose: Cast error (invalid ObjectId) ────────────────────────────────
  if (err.name === 'CastError') {
    error = ApiError.badRequest(`Invalid ${err.path}: ${err.value}`);
  }

  // ── Mongoose: Duplicate key ───────────────────────────────────────────────
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue || {})[0];
    error = ApiError.conflict(`Duplicate value for field: ${field}`);
  }

  // ── Mongoose: Validation error ────────────────────────────────────────────
  if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors).map((e) => ({
      field: e.path,
      message: e.message,
    }));
    error = ApiError.unprocessable('Mongoose validation failed', errors);
  }

  // ── JWT errors ────────────────────────────────────────────────────────────
  if (err.name === 'JsonWebTokenError') error = ApiError.unauthorized('Invalid token');
  if (err.name === 'TokenExpiredError') error = ApiError.unauthorized('Token expired');

  // ── Default to 500 if not operational ────────────────────────────────────
  const statusCode = error.statusCode || 500;
  const message = error.isOperational ? error.message : 'Internal server error';

  // ── Log ──────────────────────────────────────────────────────────────────
  if (statusCode >= 500) {
    logger.error({
      message: err.message,
      stack: err.stack,
      url: req.originalUrl,
      method: req.method,
      ip: req.ip,
    });
  } else {
    logger.warn(`[${statusCode}] ${message} — ${req.method} ${req.originalUrl}`);
  }

  res.status(statusCode).json({
    success: false,
    statusCode,
    message,
    errors: error.errors || [],
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};

// ── 404 handler for unknown routes ───────────────────────────────────────────
const notFoundHandler = (req, res, next) => {
  next(ApiError.notFound(`Route not found: ${req.method} ${req.originalUrl}`));
};

module.exports = { errorHandler, notFoundHandler };
