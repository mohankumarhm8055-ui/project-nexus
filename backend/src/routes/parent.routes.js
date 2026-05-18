'use strict';

const { Router } = require('express');
const ctrl = require('../controllers/parent.controller');
const { authenticate } = require('../middlewares/auth.middleware');
const { authorize } = require('../middlewares/role.middleware');

const router = Router();
router.use(authenticate, authorize('parent', 'admin', 'super_admin'));

router.get('/profile',                        ctrl.getProfile);
router.get('/child/:studentId/overview',      ctrl.getChildOverview);
router.get('/child/:studentId/attendance',    ctrl.getChildAttendance);
router.get('/child/:studentId/marks',         ctrl.getChildMarks);
router.get('/notifications',                  ctrl.getNotifications);

module.exports = router;
