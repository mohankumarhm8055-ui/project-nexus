'use strict';

const Joi = require('joi');

const createDriveSchema = Joi.object({
  company: Joi.object({
    name: Joi.string().required().trim(),
    logo: Joi.string().uri(),
    website: Joi.string().uri(),
    industry: Joi.string(),
    description: Joi.string().max(1000),
  }).required(),
  role: Joi.string().required().trim(),
  ctcDisplay: Joi.string(),
  ctcRange: Joi.object({
    min: Joi.number().positive(),
    max: Joi.number().positive().min(Joi.ref('min')),
  }),
  eligibility: Joi.object({
    minCGPA: Joi.number().min(0).max(10).required(),
    allowedBranches: Joi.array().items(Joi.string().hex().length(24)),
    maxBacklogs: Joi.number().integer().min(0),
    yearRequired: Joi.number().integer().min(1).max(4),
  }),
  driveDate: Joi.date().iso().min('now').required(),
  lastApplyDate: Joi.date().iso().max(Joi.ref('driveDate')),
  location: Joi.string(),
  mode: Joi.string().valid('online', 'offline', 'hybrid'),
  jobDescription: Joi.string().max(3000),
  rounds: Joi.array().items(Joi.string()),
});

const applyDriveSchema = Joi.object({
  studentId: Joi.string().hex().length(24).required(),
});

module.exports = { createDriveSchema, applyDriveSchema };
