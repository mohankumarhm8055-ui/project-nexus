'use strict';

const asyncHandler = require('../utils/asyncHandler');
const ApiResponse = require('../utils/ApiResponse');
const ApiError = require('../utils/ApiError');
const Parent = require('../models/Parent');
const attendanceService = require('../services/attendance.service');
const marksService = require('../services/marks.service');
const AIAnalytics = require('../models/AIAnalytics');
const notificationService = require('../services/notification.service');

// GET /api/v1/parent/child/:studentId/overview
const getChildOverview = asyncHandler(async (req, res) => {
  const parent = await Parent.findOne({ userId: req.user._id })
    .populate({ path: 'students', match: { _id: req.params.studentId }, populate: { path: 'department', select: 'name' } })
    .lean();

  if (!parent || !parent.students.length) throw ApiError.forbidden('You are not linked to this student');

  const student = parent.students[0];
  const [attendanceSummary, marksSummary, aiAnalytics] = await Promise.all([
    attendanceService.getStudentAttendanceSummary(student._id.toString()),
    marksService.getStudentMarksSummary(student._id.toString()),
    AIAnalytics.findOne({ student: student._id }).lean(),
  ]);

  ApiResponse.success(res, 'Child overview fetched', { student, attendanceSummary, marksSummary, aiAnalytics });
});

// GET /api/v1/parent/child/:studentId/attendance
const getChildAttendance = asyncHandler(async (req, res) => {
  const summary = await attendanceService.getStudentAttendanceSummary(
    req.params.studentId,
    { semester: req.query.semester, academicYear: req.query.academicYear }
  );
  ApiResponse.success(res, 'Child attendance fetched', summary);
});

// GET /api/v1/parent/child/:studentId/marks
const getChildMarks = asyncHandler(async (req, res) => {
  const summary = await marksService.getStudentMarksSummary(
    req.params.studentId,
    { semester: req.query.semester }
  );
  ApiResponse.success(res, 'Child marks fetched', summary);
});

// GET /api/v1/parent/notifications
const getNotifications = asyncHandler(async (req, res) => {
  const { page, limit, unreadOnly } = req.query;
  const data = await notificationService.getUserNotifications(
    req.user._id, { page, limit, unreadOnly: unreadOnly === 'true' }
  );
  ApiResponse.success(res, 'Notifications fetched', data);
});

// GET /api/v1/parent/profile
const getProfile = asyncHandler(async (req, res) => {
  const parent = await Parent.findOne({ userId: req.user._id })
    .populate('students', 'name usn semester section cgpa')
    .lean();
  if (!parent) throw ApiError.notFound('Parent profile not found');
  ApiResponse.success(res, 'Parent profile fetched', parent);
});

module.exports = { getChildOverview, getChildAttendance, getChildMarks, getNotifications, getProfile };
