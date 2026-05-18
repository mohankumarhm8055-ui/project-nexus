'use strict';

const Joi = require('joi');

const loginSchema = Joi.object({
  email: Joi.string().email().lowercase().trim(),
  identifier: Joi.string().trim().uppercase(), // USN or Employee ID
  password: Joi.string().required().min(1),
}).or('email', 'identifier');

const registerSchema = Joi.object({
  name: Joi.string().required().trim().min(2).max(100),
  email: Joi.string().email().lowercase().trim().required(),
  password: Joi.string().required().min(8).pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
    'must have uppercase, lowercase and number'),
  role: Joi.string().valid('student', 'faculty', 'hod', 'placement', 'admin', 'parent').required(),
  identifier: Joi.string().trim().uppercase(),
  phone: Joi.string().trim(),
  department: Joi.string().hex().length(24),
});

const refreshTokenSchema = Joi.object({
  refreshToken: Joi.string().required(),
});

const forgotPasswordSchema = Joi.object({
  email: Joi.string().email().lowercase().trim().required(),
});

const resetPasswordSchema = Joi.object({
  token: Joi.string().required(),
  password: Joi.string().required().min(8).pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
    'must have uppercase, lowercase and number'),
});

module.exports = {
  loginSchema,
  registerSchema,
  refreshTokenSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
};
