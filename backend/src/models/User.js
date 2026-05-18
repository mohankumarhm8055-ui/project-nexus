'use strict';

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { ROLES } = require('../constants/roles');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      maxlength: [100, 'Name cannot exceed 100 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email'],
    },
    passwordHash: {
      type: String,
      required: [true, 'Password is required'],
      minlength: 8,
      select: false, // Never return in queries by default
    },
    role: {
      type: String,
      enum: Object.values(ROLES),
      required: [true, 'Role is required'],
    },
    // Identifier: USN for students, employeeId for staff
    identifier: {
      type: String,
      unique: true,
      sparse: true,
      trim: true,
      uppercase: true,
    },
    profilePic: { type: String, default: null },
    phone: { type: String, trim: true },
    isActive: { type: Boolean, default: true },
    isEmailVerified: { type: Boolean, default: false },
    refreshTokens: [
      {
        token: String,
        createdAt: { type: Date, default: Date.now },
        expiresAt: Date,
        deviceInfo: String,
      },
    ],
    lastLogin: { type: Date },
    passwordChangedAt: { type: Date },
    passwordResetToken: { type: String, select: false },
    passwordResetExpires: { type: Date, select: false },
    // Soft delete
    deletedAt: { type: Date, default: null },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// ── Indexes ──────────────────────────────────────────────────────────────────
userSchema.index({ role: 1, isActive: 1 });
userSchema.index({ deletedAt: 1 });

// ── Pre-save: hash password ──────────────────────────────────────────────────
userSchema.pre('save', async function (next) {
  if (!this.isModified('passwordHash')) return next();
  const salt = await bcrypt.genSalt(parseInt(process.env.BCRYPT_SALT_ROUNDS) || 12);
  this.passwordHash = await bcrypt.hash(this.passwordHash, salt);
  this.passwordChangedAt = Date.now() - 1000;
  next();
});

// ── Instance method: compare password ───────────────────────────────────────
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.passwordHash);
};

// ── Instance method: safe public profile (no secrets) ───────────────────────
userSchema.methods.toSafeObject = function () {
  const obj = this.toObject();
  delete obj.passwordHash;
  delete obj.refreshTokens;
  delete obj.passwordResetToken;
  delete obj.passwordResetExpires;
  delete obj.__v;
  return obj;
};

// ── Static: soft delete ──────────────────────────────────────────────────────
userSchema.statics.softDelete = async function (id) {
  return this.findByIdAndUpdate(id, { deletedAt: new Date(), isActive: false }, { new: true });
};

// ── Query middleware: exclude soft-deleted by default ────────────────────────
userSchema.pre(/^find/, function (next) {
  if (!this.getOptions().includeSoftDeleted) {
    this.where({ deletedAt: null });
  }
  next();
});

module.exports = mongoose.model('User', userSchema);
