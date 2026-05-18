'use strict';

const asyncHandler = require('../utils/asyncHandler');
const ApiResponse = require('../utils/ApiResponse');
const ApiError = require('../utils/ApiError');
const attendanceService = require('../services/attendance.service');
const attendanceAnalyzer = require('../ai-engine/attendanceAnalyzer');
const messages = require('../constants/messages');

// POST /api/v1/attendance/mark
const markAttendance = asyncHandler(async (req, res) => {
  const { department, subject, semester, section, academicYear, date, period, records } = req.body;
  const faculty = req.user._id; // from JWT

  const result = await attendanceService.markBulkAttendance({
    department, subject, faculty, semester, section, academicYear, date, period, records,
  });
  ApiResponse.created(res, messages.ATTENDANCE.MARK_SUCCESS, result);
});

// GET /api/v1/attendance/student/:id
const getStudentAttendance = asyncHandler(async (req, res) => {
  const summary = await attendanceService.getStudentAttendanceSummary(
    req.params.id,
    { semester: req.query.semester, academicYear: req.query.academicYear }
  );
  ApiResponse.success(res, messages.ATTENDANCE.FETCH_SUCCESS, summary);
});

// GET /api/v1/attendance/student/:id/heatmap
const getAttendanceHeatmap = asyncHandler(async (req, res) => {
  const days = parseInt(req.query.days) || 30;
  const heatmap = await attendanceAnalyzer.getHeatmap(req.params.id, days);
  ApiResponse.success(res, 'Attendance heatmap fetched', heatmap);
});

// GET /api/v1/attendance/student/:id/monthly-trend
const getMonthlyTrend = asyncHandler(async (req, res) => {
  const trend = await attendanceAnalyzer.getMonthlyTrend(req.params.id);
  ApiResponse.success(res, 'Monthly trend fetched', trend);
});

// GET /api/v1/attendance/department
const getDepartmentAttendance = asyncHandler(async (req, res) => {
  const { department, semester, section, date, academicYear } = req.query;
  if (!department) throw ApiError.badRequest('Department ID is required');
  const data = await attendanceService.getDepartmentAttendance(department, { semester, section, date, academicYear });
  ApiResponse.success(res, messages.ATTENDANCE.FETCH_SUCCESS, data);
});

// GET /api/v1/attendance/low-risk
const getLowAttendanceStudents = asyncHandler(async (req, res) => {
  const { department, threshold = 75 } = req.query;
  if (!department) throw ApiError.badRequest('Department ID is required');
  const students = await attendanceService.getLowAttendanceStudents(department, parseFloat(threshold));
  ApiResponse.success(res, `Students below ${threshold}% attendance`, students);
});

module.exports = { markAttendance, getStudentAttendance, getAttendanceHeatmap, getMonthlyTrend, getDepartmentAttendance, getLowAttendanceStudents };
