'use strict';

const { verifyAccessToken } = require('../utils/tokenUtils');
const ApiError = require('../utils/ApiError');
const asyncHandler = require('../utils/asyncHandler');
const User = require('../models/User');
const { MESSAGES } = require('../constants/messages');

/**
 * Verifies Bearer JWT and attaches req.user.
 * Optionally accepts query param ?token=<token> for downloads.
 */
const authenticate = asyncHandler(async (req, res, next) => {
  let token;

  if (req.headers.authorization?.startsWith('Bearer ')) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.query.token) {
    token = req.query.token;
  }

  if (!token) {
    throw ApiError.unauthorized('No authentication token provided');
  }

  let decoded;
  try {
    decoded = verifyAccessToken(token);
  } catch (err) {
    if (err.name === 'TokenExpiredError') throw ApiError.unauthorized('Access token expired');
    throw ApiError.unauthorized('Invalid authentication token');
  }

  const user = await User.findById(decoded.id).select('-passwordHash -refreshTokens');
  if (!user) throw ApiError.unauthorized('User no longer exists');
  if (!user.isActive) throw ApiError.unauthorized('Account is deactivated');

  // Check if password changed after token was issued
  if (user.passwordChangedAt) {
    const changedTimestamp = parseInt(user.passwordChangedAt.getTime() / 1000, 10);
    if (decoded.iat < changedTimestamp) {
      throw ApiError.unauthorized('Password was recently changed. Please log in again.');
    }
  }

  req.user = user;
  next();
});

module.exports = { authenticate };
