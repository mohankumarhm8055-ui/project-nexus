'use strict';

const { Router } = require('express');
const notifCtrl = require('../controllers/notification.controller');
const reportCtrl = require('../controllers/report.controller');
const aiCtrl = require('../controllers/aiAnalytics.controller');
const facultyCtrl = require('../controllers/faculty.controller');
const uploadCtrl = require('../controllers/upload.controller');
const { authenticate } = require('../middlewares/auth.middleware');
const { authorize } = require('../middlewares/role.middleware');
const { reportLimiter } = require('../middlewares/rateLimit.middleware');

// ── Notifications ──────────────────────────────────────────────────────────
const notifRouter = Router();
notifRouter.use(authenticate);
notifRouter.get('/',          notifCtrl.getMyNotifications);
notifRouter.post('/send',     authorize('faculty', 'hod', 'admin', 'placement'), notifCtrl.sendNotification);
notifRouter.put('/read',      notifCtrl.markAsRead);
notifRouter.put('/read-all',  notifCtrl.markAllAsRead);

// ── Reports ────────────────────────────────────────────────────────────────
const reportRouter = Router();
reportRouter.use(authenticate);
reportRouter.get('/student/:id',  reportLimiter, reportCtrl.getStudentReportCard);
reportRouter.get('/department',   reportLimiter, authorize('hod', 'admin'), reportCtrl.getDepartmentReport);
reportRouter.get('/history',      reportCtrl.getReportHistory);

// ── AI Analytics ───────────────────────────────────────────────────────────
const aiRouter = Router();
aiRouter.use(authenticate);
aiRouter.get('/student/:id/risk',            aiCtrl.getStudentRisk);
aiRouter.get('/student/:id/recommendations', aiCtrl.getRecommendations);
aiRouter.get('/department/trends',           authorize('hod', 'admin'),              aiCtrl.getDeptTrends);
aiRouter.post('/analyze',                    authorize('hod', 'admin', 'faculty'),   aiCtrl.triggerAnalysis);

// ── Faculty ────────────────────────────────────────────────────────────────
const facultyRouter = Router();
facultyRouter.use(authenticate);
facultyRouter.get('/',       authorize('hod', 'admin'), facultyCtrl.getAllFaculty);
facultyRouter.get('/me',     authorize('faculty', 'hod'), facultyCtrl.getMyProfile);
facultyRouter.get('/:id',    authorize('hod', 'admin', 'faculty'), facultyCtrl.getFacultyById);
facultyRouter.put('/:id',    authorize('faculty', 'hod', 'admin'), facultyCtrl.updateFaculty);

// ── Upload ─────────────────────────────────────────────────────────────────
const uploadRouter = Router();
uploadRouter.use(authenticate);
uploadRouter.post('/profile-pic', uploadCtrl.uploadProfilePic);
uploadRouter.post('/document',    uploadCtrl.uploadDocument);
uploadRouter.post('/bulk',        uploadCtrl.uploadBulkDocuments);

module.exports = { notifRouter, reportRouter, aiRouter, facultyRouter, uploadRouter };
