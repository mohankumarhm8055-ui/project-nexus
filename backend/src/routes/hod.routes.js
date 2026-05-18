'use strict';

const { Router } = require('express');
const ctrl = require('../controllers/hod.controller');
const { authenticate } = require('../middlewares/auth.middleware');
const { authorize } = require('../middlewares/role.middleware');

const router = Router();
router.use(authenticate, authorize('hod', 'admin', 'super_admin'));

router.get('/dashboard',        ctrl.getDashboard);
router.get('/weak-students',    ctrl.getWeakStudents);
router.get('/faculty-status',   ctrl.getFacultyStatus);
router.get('/analytics',        ctrl.getDeptAnalytics);
router.post('/trigger-ai',      ctrl.triggerAIAnalysis);

module.exports = router;
