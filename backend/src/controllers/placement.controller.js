'use strict';

const asyncHandler = require('../utils/asyncHandler');
const ApiResponse = require('../utils/ApiResponse');
const ApiError = require('../utils/ApiError');
const PlacementDrive = require('../models/Placement');
const Student = require('../models/Student');
const { paginate } = require('../utils/pagination');
const cache = require('../services/cache.service');

// GET /api/v1/placement/companies
const getCompanies = asyncHandler(async (req, res) => {
  const { status, page, limit } = req.query;
  const filter = {};
  if (status) filter.status = status;
  const total = await PlacementDrive.countDocuments(filter);
  const { skip, limit: lim, meta } = paginate(req.query, total);
  const drives = await PlacementDrive.find(filter)
    .populate('eligibility.allowedBranches', 'name code')
    .sort({ driveDate: 1 })
    .skip(skip).limit(lim)
    .lean();
  ApiResponse.paginated(res, 'Placement drives fetched', drives, meta);
});

// POST /api/v1/placement/companies
const createDrive = asyncHandler(async (req, res) => {
  const drive = await PlacementDrive.create({ ...req.body, createdBy: req.user._id });
  cache.del(cache.keys.placementStats());
  ApiResponse.created(res, 'Placement drive created', drive);
});

// GET /api/v1/placement/drives/:id
const getDriveById = asyncHandler(async (req, res) => {
  const drive = await PlacementDrive.findById(req.params.id)
    .populate('applicants.student', 'name usn cgpa')
    .populate('eligibility.allowedBranches', 'name')
    .lean();
  if (!drive) throw ApiError.notFound('Placement drive not found');
  ApiResponse.success(res, 'Drive fetched', drive);
});

// POST /api/v1/placement/drives/:id/apply
const applyForDrive = asyncHandler(async (req, res) => {
  const { studentId } = req.body;
  const drive = await PlacementDrive.findById(req.params.id);
  if (!drive) throw ApiError.notFound('Drive not found');
  if (drive.status !== 'upcoming') throw ApiError.badRequest('Applications are closed for this drive');

  const student = await Student.findById(studentId).lean();
  if (!student) throw ApiError.notFound('Student not found');
  if (student.cgpa < drive.eligibility.minCGPA) {
    throw ApiError.badRequest(`Minimum CGPA required: ${drive.eligibility.minCGPA}`);
  }

  const alreadyApplied = drive.applicants.some((a) => a.student.toString() === studentId);
  if (alreadyApplied) throw ApiError.conflict('Student has already applied to this drive');

  drive.applicants.push({ student: studentId });
  await drive.save();
  ApiResponse.success(res, 'Applied successfully');
});

// GET /api/v1/placement/stats
const getStats = asyncHandler(async (req, res) => {
  const stats = await cache.getOrSet(cache.keys.placementStats(), async () => {
    const drives = await PlacementDrive.find().lean();
    const totalDrives = drives.length;
    const completedDrives = drives.filter((d) => d.status === 'completed').length;
    const totalApplicants = drives.reduce((s, d) => s + d.applicants.length, 0);
    const totalSelected = drives.reduce(
      (s, d) => s + d.applicants.filter((a) => a.status === 'selected').length, 0
    );
    return { totalDrives, completedDrives, totalApplicants, totalSelected, selectionRate: totalApplicants > 0 ? +((totalSelected / totalApplicants) * 100).toFixed(2) : 0 };
  }, 600);
  ApiResponse.success(res, 'Placement stats fetched', stats);
});

// PATCH /api/v1/placement/drives/:driveId/applicants/:studentId
const updateApplicantStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const drive = await PlacementDrive.findById(req.params.driveId);
  if (!drive) throw ApiError.notFound('Drive not found');

  const applicant = drive.applicants.find((a) => a.student.toString() === req.params.studentId);
  if (!applicant) throw ApiError.notFound('Applicant not found in this drive');

  applicant.status = status;
  if (req.body.ctcOffered) applicant.ctcOffered = req.body.ctcOffered;
  await drive.save();
  cache.del(cache.keys.placementStats());
  ApiResponse.success(res, 'Applicant status updated', applicant);
});

module.exports = { getCompanies, createDrive, getDriveById, applyForDrive, getStats, updateApplicantStatus };
