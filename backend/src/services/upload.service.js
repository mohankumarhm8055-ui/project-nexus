'use strict';

const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const ApiError = require('../utils/ApiError');
const logger = require('../config/logger');

const UPLOADS_DIR = path.join(__dirname, '../../uploads');
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const ALLOWED_DOC_TYPES = [
  'application/pdf',
  'image/jpeg',
  'image/png',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
];

const ensureUploadDir = (subDir = '') => {
  const dir = path.join(UPLOADS_DIR, subDir);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  return dir;
};

['profiles', 'documents', 'reports'].forEach(ensureUploadDir);

const createStorage = (subDir) =>
  multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, ensureUploadDir(subDir));
    },
    filename: (req, file, cb) => {
      const ext = path.extname(file.originalname).toLowerCase();
      cb(null, `${uuidv4()}${ext}`);
    },
  });

const imageFilter = (req, file, cb) => {
  if (ALLOWED_IMAGE_TYPES.includes(file.mimetype)) return cb(null, true);
  return cb(new ApiError(400, 'Only JPEG, PNG, WebP images are allowed'), false);
};

const documentFilter = (req, file, cb) => {
  if (ALLOWED_DOC_TYPES.includes(file.mimetype)) return cb(null, true);
  return cb(new ApiError(400, 'Invalid file type. Allowed: PDF, JPEG, PNG, DOCX'), false);
};

const profilePicUpload = multer({
  storage: createStorage('profiles'),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: imageFilter,
});

const documentUpload = multer({
  storage: createStorage('documents'),
  limits: { fileSize: 20 * 1024 * 1024 },
  fileFilter: documentFilter,
});

const deleteFile = (filepath) => {
  try {
    if (filepath && fs.existsSync(filepath)) {
      fs.unlinkSync(filepath);
      logger.info(`File deleted: ${filepath}`);
    }
  } catch (err) {
    logger.warn(`File delete failed: ${err.message}`);
  }
};

const buildFileUrl = (req, filepath) => {
  const relativePath = path.relative(UPLOADS_DIR, filepath).replace(/\\/g, '/');
  return `${req.protocol}://${req.get('host')}/uploads/${relativePath}`;
};

module.exports = {
  profilePicUpload,
  documentUpload,
  deleteFile,
  buildFileUrl,
  ensureUploadDir,
  UPLOADS_DIR,
};
