'use strict';

const User = require('../models/User');
const Student = require('../models/Student');
const Faculty = require('../models/Faculty');
const Parent = require('../models/Parent');
const ApiError = require('../utils/ApiError');
const { generateAccessToken, generateRefreshToken, verifyRefreshToken } = require('../utils/tokenUtils');
const logger = require('../config/logger');
const dayjs = require('dayjs');

class AuthService {
  // ── Login ──────────────────────────────────────────────────────────────────
  async login({ email, identifier, password, deviceInfo }) {
    // Find by email OR identifier (USN / Employee ID)
    const query = email ? { email: email.toLowerCase() } : { identifier: identifier.toUpperCase() };
    const user = await User.findOne(query).select('+passwordHash +refreshTokens');

    if (!user || !(await user.comparePassword(password))) {
      throw ApiError.unauthorized('Invalid credentials');
    }
    if (!user.isActive) throw ApiError.unauthorized('Account is deactivated. Contact admin.');

    const payload = { id: user._id, role: user.role, email: user.email };
    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);

    // Store refresh token (keep max 5 devices)
    user.refreshTokens.push({
      token: refreshToken,
      expiresAt: dayjs().add(7, 'day').toDate(),
      deviceInfo: deviceInfo || 'Unknown',
    });
    if (user.refreshTokens.length > 5) {
      user.refreshTokens = user.refreshTokens.slice(-5);
    }
    user.lastLogin = new Date();
    await user.save({ validateBeforeSave: false });

    // Fetch role-specific profile
    const profile = await this._getProfile(user);
    logger.info(`User logged in: ${user.email} [${user.role}]`);

    return { accessToken, refreshToken, user: user.toSafeObject(), profile };
  }

  // ── Refresh token ──────────────────────────────────────────────────────────
  async refreshToken(token) {
    let decoded;
    try {
      decoded = verifyRefreshToken(token);
    } catch {
      throw ApiError.unauthorized('Invalid or expired refresh token');
    }

    const user = await User.findById(decoded.id).select('+refreshTokens');
    if (!user) throw ApiError.unauthorized('User not found');

    const storedToken = user.refreshTokens.find((t) => t.token === token);
    if (!storedToken) throw ApiError.unauthorized('Refresh token revoked');
    if (dayjs().isAfter(dayjs(storedToken.expiresAt))) {
      throw ApiError.unauthorized('Refresh token expired');
    }

    // Rotate: remove old, issue new
    user.refreshTokens = user.refreshTokens.filter((t) => t.token !== token);
    const payload = { id: user._id, role: user.role, email: user.email };
    const newAccessToken = generateAccessToken(payload);
    const newRefreshToken = generateRefreshToken(payload);
    user.refreshTokens.push({
      token: newRefreshToken,
      expiresAt: dayjs().add(7, 'day').toDate(),
    });
    await user.save({ validateBeforeSave: false });

    return { accessToken: newAccessToken, refreshToken: newRefreshToken };
  }

  // ── Logout ─────────────────────────────────────────────────────────────────
  async logout(userId, refreshToken) {
    const user = await User.findById(userId).select('+refreshTokens');
    if (user) {
      user.refreshTokens = refreshToken
        ? user.refreshTokens.filter((t) => t.token !== refreshToken)
        : []; // logout all devices
      await user.save({ validateBeforeSave: false });
    }
  }

  // ── Register ───────────────────────────────────────────────────────────────
  async register(data) {
    const existing = await User.findOne({ email: data.email });
    if (existing) throw ApiError.conflict('Email already registered');

    const user = await User.create({
      name: data.name,
      email: data.email,
      passwordHash: data.password, // pre-save hook hashes it
      role: data.role,
      identifier: data.identifier,
      phone: data.phone,
    });

    logger.info(`New user registered: ${user.email} [${user.role}]`);
    return user.toSafeObject();
  }

  // ── Role-specific profile fetch ────────────────────────────────────────────
  async _getProfile(user) {
    switch (user.role) {
      case 'student':
        return Student.findOne({ userId: user._id }).populate('department', 'name code');
      case 'faculty':
      case 'hod':
        return Faculty.findOne({ userId: user._id }).populate('department', 'name code');
      case 'parent':
        return Parent.findOne({ userId: user._id }).populate('students', 'name usn semester');
      default:
        return null;
    }
  }
}

module.exports = new AuthService();
