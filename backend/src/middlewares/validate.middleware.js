'use strict';

const ApiError = require('../utils/ApiError');

/**
 * Validates req.body, req.query, or req.params against a Joi schema.
 * Usage: validate(myJoiSchema) or validate(myJoiSchema, 'query')
 */
const validate = (schema, target = 'body') => (req, res, next) => {
  const { error, value } = schema.validate(req[target], {
    abortEarly: false,
    stripUnknown: true,
    allowUnknown: false,
  });

  if (error) {
    const errors = error.details.map((d) => ({
      field: d.context?.key || d.path.join('.'),
      message: d.message.replace(/['"]/g, ''),
    }));
    return next(ApiError.unprocessable('Validation failed', errors));
  }

  req[target] = value; // Replace with stripped/coerced value
  next();
};

module.exports = { validate };
