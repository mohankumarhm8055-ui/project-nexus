'use strict';

const asyncHandler = require('../utils/asyncHandler');
const ApiResponse = require('../utils/ApiResponse');
const Faculty = require('../models/Faculty');
const Subject = require('../models/Subject');
const { paginate } = require('../utils/pagination');

// GET /api/v1/faculty
const getAllFaculty = asyncHandler(async (req, res) => {
  const { department } = req.query;
  const filter = {};
  if (department) filter.department = department;
  const total = await Faculty.countDocuments(filter);
  const { skip, limit, meta } = paginate(req.query, total);
  const faculty = await Faculty.find(filter).populate('department', 'name code').populate('subjects', 'name code').skip(skip).limit(limit).lean();
  ApiResponse.paginated(res, 'Faculty fetched', faculty, meta);
});

// GET /api/v1/faculty/:id
const getFacultyById = asyncHandler(async (req, res) => {
  const faculty = await Faculty.findById(req.params.id)
    .populate('department', 'name code').populate('subjects', 'name code semester').lean();
  if (!faculty) throw require('../utils/ApiError').notFound('Faculty not found');
  ApiResponse.success(res, 'Faculty fetched', faculty);
});

// GET /api/v1/faculty/me
const getMyProfile = asyncHandler(async (req, res) => {
  const faculty = await Faculty.findOne({ userId: req.user._id })
    .populate('department', 'name code').populate('subjects', 'name code semester type').lean();
  ApiResponse.success(res, 'Faculty profile fetched', faculty);
});

// PUT /api/v1/faculty/:id
const updateFaculty = asyncHandler(async (req, res) => {
  const allowed = ['phone', 'specialization', 'qualifications', 'profilePic'];
  const updates = {};
  allowed.forEach((k) => { if (req.body[k] !== undefined) updates[k] = req.body[k]; });
  const faculty = await Faculty.findByIdAndUpdate(req.params.id, updates, { new: true });
  ApiResponse.success(res, 'Faculty updated', faculty);
});

module.exports = { getAllFaculty, getFacultyById, getMyProfile, updateFaculty };
