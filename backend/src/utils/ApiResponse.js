'use strict';

/**
 * Standard API Response envelope
 * { success, statusCode, message, data, pagination }
 */
class ApiResponse {
  constructor(statusCode, message, data = null, pagination = null) {
    this.success = statusCode < 400;
    this.statusCode = statusCode;
    this.message = message;
    if (data !== null) this.data = data;
    if (pagination !== null) this.pagination = pagination;
  }

  static success(res, message, data = null, statusCode = 200) {
    return res.status(statusCode).json(new ApiResponse(statusCode, message, data));
  }

  static paginated(res, message, data, paginationMeta) {
    return res.status(200).json(new ApiResponse(200, message, data, paginationMeta));
  }

  static created(res, message, data = null) {
    return res.status(201).json(new ApiResponse(201, message, data));
  }

  static noContent(res) {
    return res.status(204).send();
  }
}

module.exports = ApiResponse;
