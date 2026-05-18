'use strict';

const { Router } = require('express');
const ctrl = require('../controllers/marks.controller');
const { authenticate } = require('../middlewares/auth.middleware');
const { authorize } = require('../middlewares/role.middleware');
const { validate } = require('../middlewares/validate.middleware');
const { auditLogger } = require('../middlewares/audit.middleware');
const { uploadMarksSchema, updateMarksSchema, publishMarksSchema } = require('../validations/marks.validation');

const router = Router();
router.use(authenticate);

router.post('/upload', authorize('faculty', 'hod', 'admin'),
  validate(uploadMarksSchema), auditLogger('UPLOAD_MARKS', 'Marks'), ctrl.uploadMarks);

router.post('/publish', authorize('faculty', 'hod', 'admin'),
  validate(publishMarksSchema), auditLogger('PUBLISH_MARKS', 'Marks'), ctrl.publishMarks);

router.get('/student/:id', authorize('student', 'faculty', 'hod', 'admin', 'parent'), ctrl.getStudentMarks);
router.get('/subject/:id', authorize('faculty', 'hod', 'admin'), ctrl.getSubjectMarks);
router.get('/grade-report/:studentId', authorize('student', 'faculty', 'hod', 'admin', 'parent'), ctrl.getGradeReport);
router.put('/:id', authorize('faculty', 'hod', 'admin'), validate(updateMarksSchema), auditLogger('UPDATE_MARKS', 'Marks'), ctrl.updateMark);

module.exports = router;
