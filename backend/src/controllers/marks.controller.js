'use strict';

const asyncHandler = require('../utils/asyncHandler');
const ApiResponse = require('../utils/ApiResponse');
const ApiError = require('../utils/ApiError');
const marksService = require('../services/marks.service');
const Marks = require('../models/Marks');
const messages = require('../constants/messages');

// POST /api/v1/marks/upload
const uploadMarks = asyncHandler(async (req, res) => {
  const { subject, department, semester, academicYear, type, maxMarks, records } = req.body;
  const faculty = req.user._id;
  const result = await marksService.uploadMarks({ subject, department, faculty, semester, academicYear, type, maxMarks, records });
  ApiResponse.created(res, messages.MARKS.UPLOAD_SUCCESS, result);
});

// GET /api/v1/marks/student/:id
const getStudentMarks = asyncHandler(async (req, res) => {
  const summary = await marksService.getStudentMarksSummary(
    req.params.id,
    { semester: req.query.semester, academicYear: req.query.academicYear }
  );
  ApiResponse.success(res, messages.MARKS.FETCH_SUCCESS, summary);
});

// GET /api/v1/marks/subject/:id
const getSubjectMarks = asyncHandler(async (req, res) => {
  const { semester, academicYear, type } = req.query;
  const filter = { subject: req.params.id };
  if (semester) filter.semester = parseInt(semester);
  if (academicYear) filter.academicYear = academicYear;
  if (type) filter.type = type;

  const marks = await Marks.find(filter)
    .populate('student', 'name usn')
    .sort({ 'student.usn': 1 })
    .lean();
  ApiResponse.success(res, messages.MARKS.FETCH_SUCCESS, marks);
});

// PUT /api/v1/marks/:id
const updateMark = asyncHandler(async (req, res) => {
  const updated = await marksService.updateMark(req.params.id, req.body, req.user.email);
  ApiResponse.success(res, messages.MARKS.UPDATE_SUCCESS, updated);
});

// POST /api/v1/marks/publish
const publishMarks = asyncHandler(async (req, res) => {
  const { marksIds } = req.body;
  const result = await marksService.publishMarks(marksIds, req.user.email);
  ApiResponse.success(res, `${result.modifiedCount} marks records published`, result);
});

// GET /api/v1/marks/grade-report/:studentId
const getGradeReport = asyncHandler(async (req, res) => {
  const summary = await marksService.getStudentMarksSummary(req.params.studentId);
  const { calcSGPA } = require('../helpers/gradeCalc');
  const sgpa = calcSGPA(summary.subjects);
  ApiResponse.success(res, 'Grade report fetched', { ...summary, sgpa });
});

module.exports = { uploadMarks, getStudentMarks, getSubjectMarks, updateMark, publishMarks, getGradeReport };
