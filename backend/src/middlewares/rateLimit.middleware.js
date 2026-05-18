'use strict';

const rateLimit = require('express-rate-limit');
const ApiError = require('../utils/ApiError');

const createLimiter = (windowMs, max, message) =>
  rateLimit({
    windowMs,
    max,
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req, res, next) => {
      next(new ApiError(429, message || 'Too many requests. Please slow down.'));
    },
    skip: (req) => process.env.NODE_ENV === 'test',
  });

// General API limiter: 100 req / 15 min
const generalLimiter = createLimiter(
  parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000,
  parseInt(process.env.RATE_LIMIT_MAX) || 100,
  'Too many requests. Please try again in 15 minutes.'
);

// Auth routes: 10 req / 15 min
const authLimiter = createLimiter(
  15 * 60 * 1000,
  parseInt(process.env.AUTH_RATE_LIMIT_MAX) || 10,
  'Too many login attempts. Please try again in 15 minutes.'
);

// Report generation: 5 per hour
const reportLimiter = createLimiter(60 * 60 * 1000, 5, 'Report generation limit reached. Try again in an hour.');

module.exports = { generalLimiter, authLimiter, reportLimiter };
