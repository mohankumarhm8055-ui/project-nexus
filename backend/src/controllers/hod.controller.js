'use strict';

const asyncHandler = require('../utils/asyncHandler');
const ApiResponse = require('../utils/ApiResponse');
const ApiError = require('../utils/ApiError');
const Student = require('../models/Student');
const Faculty = require('../models/Faculty');
const AIAnalytics = require('../models/AIAnalytics');
const Attendance = require('../models/Attendance');
const Marks = require('../models/Marks');
const cache = require('../services/cache.service');
const attendanceService = require('../services/attendance.service');
const riskPredictor = require('../ai-engine/riskPredictor');
const { paginate } = require('../utils/pagination');

// GET /api/v1/hod/dashboard
const getDashboard = asyncHandler(async (req, res) => {
  const hodFaculty = await Faculty.findOne({ userId: req.user._id }).lean();
  if (!hodFaculty) throw ApiError.notFound('HOD profile not found');
  const deptId = hodFaculty.department;

  const cacheKey = cache.keys.hodDashboard(deptId);
  const data = await cache.getOrSet(cacheKey, async () => {
    const [totalStudents, totalFaculty, lowAttStudents, atRiskStudents] = await Promise.all([
      Student.countDocuments({ department: deptId, isActive: true }),
      Faculty.countDocuments({ department: deptId, isActive: true }),
      attendanceService.getLowAttendanceStudents(deptId.toString(), 75),
      AIAnalytics.countDocuments({ detentionRisk: true }),
    ]);

    return { totalStudents, totalFaculty, lowAttendanceCount: lowAttStudents.length, atRiskCount: atRiskStudents };
  }, 120);

  ApiResponse.success(res, 'HOD dashboard fetched', data);
});

// GET /api/v1/hod/weak-students
const getWeakStudents = asyncHandler(async (req, res) => {
  const hodFaculty = await Faculty.findOne({ userId: req.user._id }).lean();
  const deptId = hodFaculty?.department;

  const riskStudents = await AIAnalytics.find({
    riskLevel: { $in: ['high', 'critical'] },
  })
    .populate({ path: 'student', match: { department: deptId }, select: 'name usn semester section' })
    .sort({ riskScore: -1 })
    .lean();

  const filtered = riskStudents.filter((r) => r.student !== null);
  ApiResponse.success(res, 'At-risk students fetched', filtered);
});

// GET /api/v1/hod/faculty-status
const getFacultyStatus = asyncHandler(async (req, res) => {
  const hodFaculty = await Faculty.findOne({ userId: req.user._id }).lean();
  const faculties = await Faculty.find({ department: hodFaculty?.department, isActive: true })
    .populate('subjects', 'name code')
    .lean();
  ApiResponse.success(res, 'Faculty status fetched', faculties);
});

// GET /api/v1/hod/analytics
const getDeptAnalytics = asyncHandler(async (req, res) => {
  const hodFaculty = await Faculty.findOne({ userId: req.user._id }).lean();
  const deptId = hodFaculty?.department;

  const students = await Student.find({ department: deptId, isActive: true }).lean();
  const studentIds = students.map((s) => s._id);

  const [analyticsData, avgAttendance] = await Promise.all([
    AIAnalytics.find({ student: { $in: studentIds } }).lean(),
    Attendance.aggregate([
      { $match: { department: deptId } },
      { $group: { _id: null, total: { $sum: 1 }, present: { $sum: { $cond: [{ $eq: ['$status', 'present'] }, 1, 0] } } } },
    ]),
  ]);

  const riskDistribution = { low: 0, medium: 0, high: 0, critical: 0 };
  analyticsData.forEach((a) => { riskDistribution[a.riskLevel]++; });

  const overallAttPct = avgAttendance[0]
    ? +((avgAttendance[0].present / avgAttendance[0].total) * 100).toFixed(2)
    : 0;

  ApiResponse.success(res, 'Department analytics fetched', {
    totalStudents: students.length,
    riskDistribution,
    overallAttendancePercentage: overallAttPct,
    studentsAnalyzed: analyticsData.length,
  });
});

// POST /api/v1/hod/trigger-ai-analysis
const triggerAIAnalysis = asyncHandler(async (req, res) => {
  const hodFaculty = await Faculty.findOne({ userId: req.user._id }).lean();
  if (!hodFaculty) throw ApiError.notFound('HOD profile not found');
  // Run async — don't block response
  setImmediate(() => riskPredictor.analyzeDepartment(hodFaculty.department.toString()));
  ApiResponse.success(res, 'AI analysis triggered in background');
});

module.exports = { getDashboard, getWeakStudents, getFacultyStatus, getDeptAnalytics, triggerAIAnalysis };
