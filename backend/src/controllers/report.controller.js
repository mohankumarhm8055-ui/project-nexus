'use strict';

const asyncHandler = require('../utils/asyncHandler');
const ApiResponse = require('../utils/ApiResponse');
const ApiError = require('../utils/ApiError');
const reportService = require('../services/report.service');
const Report = require('../models/Report');
const path = require('path');
const fs = require('fs');

// GET /api/v1/reports/student/:id — Download PDF report card
const getStudentReportCard = asyncHandler(async (req, res) => {
  const { semester = 5, academicYear = '2024-25' } = req.query;
  const filepath = await reportService.generateStudentReportCard(
    req.params.id, { semester: parseInt(semester), academicYear }
  );

  if (!fs.existsSync(filepath)) throw ApiError.internal('Report file not generated');
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `attachment; filename="${path.basename(filepath)}"`);
  fs.createReadStream(filepath).pipe(res);
});

// GET /api/v1/reports/department — Download Excel
const getDepartmentReport = asyncHandler(async (req, res) => {
  const { department, semester = 5, academicYear = '2024-25' } = req.query;
  if (!department) throw ApiError.badRequest('Department ID required');
  const filepath = await reportService.generateDepartmentExcel(department, { semester: parseInt(semester), academicYear });

  res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
  res.setHeader('Content-Disposition', `attachment; filename="${path.basename(filepath)}"`);
  fs.createReadStream(filepath).pipe(res);
});

// GET /api/v1/reports/history
const getReportHistory = asyncHandler(async (req, res) => {
  const reports = await Report.find({ generatedBy: req.user._id })
    .sort({ createdAt: -1 }).limit(20).lean();
  ApiResponse.success(res, 'Report history fetched', reports);
});

module.exports = { getStudentReportCard, getDepartmentReport, getReportHistory };
