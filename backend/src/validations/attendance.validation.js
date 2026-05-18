'use strict';

const Joi = require('joi');

const markAttendanceSchema = Joi.object({
  department: Joi.string().hex().length(24).required(),
  subject: Joi.string().hex().length(24).required(),
  semester: Joi.number().integer().min(1).max(8).required(),
  section: Joi.string().uppercase().max(2).required(),
  academicYear: Joi.string().pattern(/^\d{4}-\d{2}$/).required(),
  date: Joi.date().iso().max('now').required(),
  period: Joi.number().integer().min(1).max(8),
  records: Joi.array()
    .items(
      Joi.object({
        studentId: Joi.string().hex().length(24).required(),
        status: Joi.string().valid('present', 'absent', 'late', 'excused').required(),
        remarks: Joi.string().max(200),
      })
    )
    .min(1)
    .required(),
});

const getAttendanceQuerySchema = Joi.object({
  from: Joi.date().iso(),
  to: Joi.date().iso().min(Joi.ref('from')),
  semester: Joi.number().integer().min(1).max(8),
  subject: Joi.string().hex().length(24),
  academicYear: Joi.string(),
  page: Joi.number().integer().min(1),
  limit: Joi.number().integer().min(1).max(100),
});

module.exports = { markAttendanceSchema, getAttendanceQuerySchema };
