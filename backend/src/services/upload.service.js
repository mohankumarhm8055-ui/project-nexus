'use strict';

const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const ApiError = require('../utils/ApiError');
const logger = require('../config/logger');

const UPLOADS_DIR = path.join(__dirname, '../../src/uploads');
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const ALLOWED_DOC_TYPES = ['application/pdf', 'image/jpeg', 'image/png', 'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];

// ── Disk storage factory ──────────────────────────────────────────────────────
const createStorage = (subDir) =>
  multer.diskStorage({
    destination: (req, file, cb) => {
      const dir = path.join(UPLOADS_DIR, subDir);
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
      cb(null, dir);
    },
    filename: (req, file, cb) => {
      const ext = path.extname(file.originalname).toLowerCase();
      const name = `${uuidv4()}${ext}`;
      cb(null, name);
    },
  });

// ── File filters ──────────────────────────────────────────────────────────────
const imageFilter = (req, file, cb) => {
  if (ALLOWED_IMAGE_TYPES.includes(file.mimetype)) cb(null, true);
  else cb(new ApiError(400, 'Only JPEG, PNG, WebP images are allowed'), false);
};

const documentFilter = (req, file, cb) => {
  if (ALLOWED_DOC_TYPES.includes(file.mimetype)) cb(null, true);
  else cb(new ApiError(400, 'Invalid file type. Allowed: PDF, JPEG, PNG, DOCX'), false);
};

// ── Multer instances ──────────────────────────────────────────────────────────
const profilePicUpload = multer({
  storage: createStorage('profiles'),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: imageFilter,
});

const documentUpload = multer({
  storage: createStorage('documents'),
  limits: { fileSize: 20 * 1024 * 1024 }, // 20MB
  fileFilter: documentFilter,
});

// ── Delete file ───────────────────────────────────────────────────────────────
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

// ── Build public URL ──────────────────────────────────────────────────────────
const buildFileUrl = (req, filepath) => {
  const relativePath = filepath.replace(UPLOADS_DIR, '').replace(/\\/g, '/');
  return `${req.protocol}://${req.get('host')}/uploads${relativePath}`;
};

module.exports = { profilePicUpload, documentUpload, deleteFile, buildFileUrl, UPLOADS_DIR };
