'use strict';

const Joi = require('joi');

const uploadMarksSchema = Joi.object({
  subject: Joi.string().hex().length(24).required(),
  department: Joi.string().hex().length(24).required(),
  semester: Joi.number().integer().min(1).max(8).required(),
  academicYear: Joi.string().pattern(/^\d{4}-\d{2}$/).required(),
  type: Joi.string()
    .valid('internal1', 'internal2', 'internal3', 'lab', 'assignment', 'quiz', 'project', 'external')
    .required(),
  maxMarks: Joi.number().positive().max(200).required(),
  records: Joi.array()
    .items(
      Joi.object({
        studentId: Joi.string().hex().length(24).required(),
        marks: Joi.number().min(0).required(),
        remarks: Joi.string().max(300),
      })
    )
    .min(1)
    .required(),
});

const updateMarksSchema = Joi.object({
  marks: Joi.number().min(0).required(),
  remarks: Joi.string().max(300),
});

const publishMarksSchema = Joi.object({
  marksIds: Joi.array().items(Joi.string().hex().length(24)).min(1).required(),
});

module.exports = { uploadMarksSchema, updateMarksSchema, publishMarksSchema };
