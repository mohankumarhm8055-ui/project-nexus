'use strict';

const { Router } = require('express');
const ctrl = require('../controllers/attendance.controller');
const { authenticate } = require('../middlewares/auth.middleware');
const { authorize } = require('../middlewares/role.middleware');
const { validate } = require('../middlewares/validate.middleware');
const { auditLogger } = require('../middlewares/audit.middleware');
const { markAttendanceSchema, getAttendanceQuerySchema } = require('../validations/attendance.validation');

const router = Router();
router.use(authenticate);

router.post('/mark', authorize('faculty', 'hod', 'admin'),
  validate(markAttendanceSchema), auditLogger('MARK_ATTENDANCE', 'Attendance'), ctrl.markAttendance);

router.get('/department',   authorize('faculty', 'hod', 'admin'),        ctrl.getDepartmentAttendance);
router.get('/low-risk',     authorize('hod', 'admin'),                   ctrl.getLowAttendanceStudents);

router.get('/student/:id',              authorize('student', 'faculty', 'hod', 'admin', 'parent'), ctrl.getStudentAttendance);
router.get('/student/:id/heatmap',      authorize('student', 'faculty', 'hod', 'admin', 'parent'), ctrl.getAttendanceHeatmap);
router.get('/student/:id/monthly-trend',authorize('student', 'faculty', 'hod', 'admin', 'parent'), ctrl.getMonthlyTrend);

module.exports = router;
