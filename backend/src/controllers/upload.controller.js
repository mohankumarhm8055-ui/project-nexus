'use strict';

const asyncHandler = require('../utils/asyncHandler');
const ApiResponse = require('../utils/ApiResponse');
const ApiError = require('../utils/ApiError');
const { profilePicUpload, documentUpload, buildFileUrl } = require('../services/upload.service');
const User = require('../models/User');
const Student = require('../models/Student');

// POST /api/v1/upload/profile-pic
const uploadProfilePic = [
  profilePicUpload.single('file'),
  asyncHandler(async (req, res) => {
    if (!req.file) throw ApiError.badRequest('No file uploaded');
    const fileUrl = buildFileUrl(req, req.file.path);

    // Update user profile pic
    await User.findByIdAndUpdate(req.user._id, { profilePic: fileUrl });
    if (['student'].includes(req.user.role)) {
      await Student.findOneAndUpdate({ userId: req.user._id }, { profilePic: fileUrl });
    }
    ApiResponse.success(res, 'Profile picture uploaded', { url: fileUrl, filename: req.file.filename });
  }),
];

// POST /api/v1/upload/document
const uploadDocument = [
  documentUpload.single('file'),
  asyncHandler(async (req, res) => {
    if (!req.file) throw ApiError.badRequest('No file uploaded');
    const fileUrl = buildFileUrl(req, req.file.path);
    ApiResponse.created(res, 'Document uploaded', {
      url: fileUrl,
      filename: req.file.filename,
      originalName: req.file.originalname,
      size: req.file.size,
      mimeType: req.file.mimetype,
    });
  }),
];

// POST /api/v1/upload/bulk
const uploadBulkDocuments = [
  documentUpload.array('files', 5),
  asyncHandler(async (req, res) => {
    if (!req.files?.length) throw ApiError.badRequest('No files uploaded');
    const files = req.files.map((f) => ({
      url: buildFileUrl(req, f.path),
      filename: f.filename,
      originalName: f.originalname,
      size: f.size,
    }));
    ApiResponse.created(res, `${files.length} files uploaded`, files);
  }),
];

module.exports = { uploadProfilePic, uploadDocument, uploadBulkDocuments };
