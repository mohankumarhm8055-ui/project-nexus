'use strict';

/**
 * Builds pagination metadata and DB query options.
 * @param {object} query - Express req.query
 * @param {number} totalItems - Total count from DB
 * @returns {{ skip, limit, meta }}
 */
const paginate = (query, totalItems) => {
  const page = Math.max(1, parseInt(query.page, 10) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(query.limit, 10) || 20));
  const skip = (page - 1) * limit;
  const totalPages = Math.ceil(totalItems / limit);

  return {
    skip,
    limit,
    meta: {
      currentPage: page,
      totalPages,
      totalItems,
      itemsPerPage: limit,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
    },
  };
};

module.exports = { paginate };
