'use strict';

const asyncHandler = require('../utils/asyncHandler');
const ApiResponse = require('../utils/ApiResponse');
const ApiError = require('../utils/ApiError');
const Student = require('../models/Student');
const { paginate } = require('../utils/pagination');
const cache = require('../services/cache.service');
const attendanceService = require('../services/attendance.service');
const marksService = require('../services/marks.service');
const AIAnalytics = require('../models/AIAnalytics');
const messages = require('../constants/messages');

// GET /api/v1/students
const getAllStudents = asyncHandler(async (req, res) => {
  const { department, semester, section, year, search } = req.query;
  const filter = {};
  if (department) filter.department = department;
  if (semester) filter.semester = parseInt(semester);
  if (section) filter.section = section.toUpperCase();
  if (year) filter.year = parseInt(year);
  if (search) filter.$or = [
    { name: { $regex: search, $options: 'i' } },
    { usn: { $regex: search, $options: 'i' } },
  ];

  const total = await Student.countDocuments(filter);
  const { skip, limit, meta } = paginate(req.query, total);
  const students = await Student.find(filter)
    .populate('department', 'name code')
    .skip(skip).limit(limit)
    .sort({ name: 1 })
    .lean();

  ApiResponse.paginated(res, messages.STUDENT.FETCH_SUCCESS, students, meta);
});

// GET /api/v1/students/:id
const getStudentById = asyncHandler(async (req, res) => {
  const cacheKey = cache.keys.studentSummary(req.params.id);
  const student = await cache.getOrSet(cacheKey, async () =>
    Student.findById(req.params.id)
      .populate('department', 'name code')
      .populate('parentId', 'name phone email')
      .lean()
  );
  if (!student) throw ApiError.notFound(messages.STUDENT.NOT_FOUND);
  ApiResponse.success(res, messages.STUDENT.FETCH_ONE_SUCCESS, student);
});

// PUT /api/v1/students/:id
const updateStudent = asyncHandler(async (req, res) => {
  const allowed = ['name', 'phone', 'address', 'skills', 'profilePic'];
  const updates = {};
  allowed.forEach((key) => { if (req.body[key] !== undefined) updates[key] = req.body[key]; });

  const student = await Student.findByIdAndUpdate(req.params.id, updates, { new: true, runValidators: true })
    .populate('department', 'name code');
  if (!student) throw ApiError.notFound(messages.STUDENT.NOT_FOUND);

  cache.del(cache.keys.studentSummary(req.params.id));
  ApiResponse.success(res, messages.STUDENT.UPDATE_SUCCESS, student);
});

// GET /api/v1/students/:id/attendance-summary
const getAttendanceSummary = asyncHandler(async (req, res) => {
  const summary = await attendanceService.getStudentAttendanceSummary(
    req.params.id, { semester: req.query.semester, academicYear: req.query.academicYear }
  );
  ApiResponse.success(res, 'Attendance summary fetched', summary);
});

// GET /api/v1/students/:id/marks-summary
const getMarksSummary = asyncHandler(async (req, res) => {
  const summary = await marksService.getStudentMarksSummary(
    req.params.id, { semester: req.query.semester, academicYear: req.query.academicYear }
  );
  ApiResponse.success(res, 'Marks summary fetched', summary);
});

// GET /api/v1/students/:id/ai-analytics
const getAIAnalytics = asyncHandler(async (req, res) => {
  const cacheKey = cache.keys.aiAnalytics(req.params.id);
  const analytics = await cache.getOrSet(cacheKey, () =>
    AIAnalytics.findOne({ student: req.params.id })
      .populate('subjectsAtRisk', 'name code')
      .lean(), 300
  );
  if (!analytics) throw ApiError.notFound('AI analytics not yet generated for this student');
  ApiResponse.success(res, 'AI analytics fetched', analytics);
});

module.exports = { getAllStudents, getStudentById, updateStudent, getAttendanceSummary, getMarksSummary, getAIAnalytics };
