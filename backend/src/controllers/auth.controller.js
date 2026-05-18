'use strict';

const asyncHandler = require('../utils/asyncHandler');
const ApiResponse = require('../utils/ApiResponse');
const ApiError = require('../utils/ApiError');
const authService = require('../services/auth.service');
const { MESSAGES } = require('../constants/messages');
const messages = require('../constants/messages');

// POST /api/v1/auth/login
const login = asyncHandler(async (req, res) => {
  const { email, identifier, password } = req.body;
  const deviceInfo = req.headers['user-agent'];
  const result = await authService.login({ email, identifier, password, deviceInfo });
  ApiResponse.success(res, messages.AUTH.LOGIN_SUCCESS, result);
});

// POST /api/v1/auth/register
const register = asyncHandler(async (req, res) => {
  const user = await authService.register(req.body);
  ApiResponse.created(res, messages.AUTH.REGISTER_SUCCESS, user);
});

// POST /api/v1/auth/refresh-token
const refreshToken = asyncHandler(async (req, res) => {
  const { refreshToken } = req.body;
  const tokens = await authService.refreshToken(refreshToken);
  ApiResponse.success(res, messages.AUTH.TOKEN_REFRESHED, tokens);
});

// POST /api/v1/auth/logout
const logout = asyncHandler(async (req, res) => {
  await authService.logout(req.user._id, req.body.refreshToken);
  ApiResponse.success(res, messages.AUTH.LOGOUT_SUCCESS);
});

// GET /api/v1/auth/me
const getMe = asyncHandler(async (req, res) => {
  ApiResponse.success(res, 'Profile fetched', req.user.toSafeObject
    ? req.user.toSafeObject()
    : req.user);
});

// POST /api/v1/auth/forgot-password
const forgotPassword = asyncHandler(async (req, res) => {
  // Stub: In production, generate reset token and email
  ApiResponse.success(res, messages.AUTH.PASSWORD_RESET_SENT);
});

// POST /api/v1/auth/reset-password
const resetPassword = asyncHandler(async (req, res) => {
  // Stub: In production, validate token and update password
  ApiResponse.success(res, messages.AUTH.PASSWORD_RESET_SUCCESS);
});

module.exports = { login, register, refreshToken, logout, getMe, forgotPassword, resetPassword };
