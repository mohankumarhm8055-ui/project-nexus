'use strict';

const { Router } = require('express');
const authRoutes = require('./auth.routes');
const studentRoutes = require('./student.routes');
const attendanceRoutes = require('./attendance.routes');
const marksRoutes = require('./marks.routes');
const hodRoutes = require('./hod.routes');
const parentRoutes = require('./parent.routes');
const placementRoutes = require('./placement.routes');
const adminRoutes = require('./admin.routes');
const { notifRouter, reportRouter, aiRouter, facultyRouter, uploadRouter } = require('./misc.routes');

const router = Router();

// ── Health check ─────────────────────────────────────────────────────────────
router.get('/health', (req, res) => {
  res.json({
    success: true,
    status: 'operational',
    service: 'Nexus Intellect API',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
  });
});

// ── Route registration ────────────────────────────────────────────────────────
router.use('/auth',          authRoutes);
router.use('/students',      studentRoutes);
router.use('/attendance',    attendanceRoutes);
router.use('/marks',         marksRoutes);
router.use('/hod',           hodRoutes);
router.use('/parent',        parentRoutes);
router.use('/placement',     placementRoutes);
router.use('/admin',         adminRoutes);
router.use('/notifications', notifRouter);
router.use('/reports',       reportRouter);
router.use('/ai',            aiRouter);
router.use('/faculty',       facultyRouter);
router.use('/upload',        uploadRouter);

module.exports = router;
