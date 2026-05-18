'use strict';

const asyncHandler = require('../utils/asyncHandler');
const ApiResponse = require('../utils/ApiResponse');
const ApiError = require('../utils/ApiError');
const riskPredictor = require('../ai-engine/riskPredictor');
const performanceAdvisor = require('../ai-engine/performanceAdvisor');
const attendanceAnalyzer = require('../ai-engine/attendanceAnalyzer');
const AIAnalytics = require('../models/AIAnalytics');
const Student = require('../models/Student');
const marksService = require('../services/marks.service');
const cache = require('../services/cache.service');

// GET /api/v1/ai/student/:id/risk
const getStudentRisk = asyncHandler(async (req, res) => {
  const cacheKey = cache.keys.aiAnalytics(req.params.id);
  const analytics = await cache.getOrSet(cacheKey, () =>
    AIAnalytics.findOne({ student: req.params.id }).populate('subjectsAtRisk', 'name code').lean()
  );
  if (!analytics) throw ApiError.notFound('AI analytics not yet computed. Trigger analysis first.');
  ApiResponse.success(res, 'Student risk profile fetched', analytics);
});

// GET /api/v1/ai/student/:id/recommendations
const getRecommendations = asyncHandler(async (req, res) => {
  const marksSummary = await marksService.getStudentMarksSummary(req.params.id);
  const analytics = await AIAnalytics.findOne({ student: req.params.id }).lean();

  const subjectRecs = performanceAdvisor.getSubjectRecommendations(marksSummary.subjects);
  const overallAdvice = performanceAdvisor.getOverallAdvice(
    analytics?.riskLevel || 'low',
    analytics?.attendanceTrend?.current,
    marksSummary.overallPercentage
  );
  const weakSubjects = marksSummary.subjects.filter((s) => s.percentage < 60);
  const studyPlan = performanceAdvisor.generateStudyPlan(weakSubjects);

  ApiResponse.success(res, 'Recommendations fetched', { subjectRecommendations: subjectRecs, overallAdvice, studyPlan });
});

// GET /api/v1/ai/department/trends
const getDeptTrends = asyncHandler(async (req, res) => {
  const { department } = req.query;
  if (!department) throw ApiError.badRequest('Department ID required');

  const students = await Student.find({ department, isActive: true }).lean();
  const ids = students.map((s) => s._id);
  const analytics = await AIAnalytics.find({ student: { $in: ids } }).lean();

  const riskDist = { low: 0, medium: 0, high: 0, critical: 0 };
  const trendDist = { improving: 0, stable: 0, declining: 0, critical: 0 };
  let avgRiskScore = 0;

  analytics.forEach((a) => {
    riskDist[a.riskLevel]++;
    trendDist[a.performanceTrend]++;
    avgRiskScore += a.riskScore;
  });

  avgRiskScore = analytics.length ? +(avgRiskScore / analytics.length).toFixed(2) : 0;
  ApiResponse.success(res, 'Department trends fetched', { riskDistribution: riskDist, trendDistribution: trendDist, avgRiskScore, totalAnalyzed: analytics.length });
});

// POST /api/v1/ai/analyze
const triggerAnalysis = asyncHandler(async (req, res) => {
  const { studentId, departmentId } = req.body;
  if (studentId) {
    const result = await riskPredictor.analyzeStudent(studentId);
    ApiResponse.success(res, 'Student analysis complete', result);
  } else if (departmentId) {
    setImmediate(() => riskPredictor.analyzeDepartment(departmentId));
    ApiResponse.success(res, 'Department analysis triggered in background');
  } else {
    throw ApiError.badRequest('Provide studentId or departmentId');
  }
});

module.exports = { getStudentRisk, getRecommendations, getDeptTrends, triggerAnalysis };
