'use strict';

const { Router } = require('express');
const ctrl = require('../controllers/student.controller');
const { authenticate } = require('../middlewares/auth.middleware');
const { authorize } = require('../middlewares/role.middleware');

const router = Router();
const STAFF = ['faculty', 'hod', 'admin', 'super_admin', 'placement'];
const ALL_STAFF_AND_PARENT = [...STAFF, 'parent'];

router.use(authenticate);

router.get('/',           authorize(...STAFF),                ctrl.getAllStudents);
router.get('/:id',        authorize(...ALL_STAFF_AND_PARENT, 'student'), ctrl.getStudentById);
router.put('/:id',        authorize('admin', 'super_admin'),  ctrl.updateStudent);

router.get('/:id/attendance-summary', authorize(...ALL_STAFF_AND_PARENT, 'student'), ctrl.getAttendanceSummary);
router.get('/:id/marks-summary',      authorize(...ALL_STAFF_AND_PARENT, 'student'), ctrl.getMarksSummary);
router.get('/:id/ai-analytics',       authorize(...STAFF),                           ctrl.getAIAnalytics);

module.exports = router;
