'use strict';

const { Router } = require('express');
const ctrl = require('../controllers/placement.controller');
const { authenticate } = require('../middlewares/auth.middleware');
const { authorize } = require('../middlewares/role.middleware');
const { validate } = require('../middlewares/validate.middleware');
const { auditLogger } = require('../middlewares/audit.middleware');
const { createDriveSchema, applyDriveSchema } = require('../validations/placement.validation');

const router = Router();
router.use(authenticate);

router.get('/companies',    ctrl.getCompanies);
router.get('/stats',        ctrl.getStats);
router.get('/drives/:id',   ctrl.getDriveById);

router.post('/companies',   authorize('placement', 'admin'), validate(createDriveSchema), auditLogger('CREATE_DRIVE', 'PlacementDrive'), ctrl.createDrive);
router.post('/drives/:id/apply', authorize('student', 'placement', 'admin'), validate(applyDriveSchema), ctrl.applyForDrive);
router.patch('/drives/:driveId/applicants/:studentId', authorize('placement', 'admin'), auditLogger('UPDATE_APPLICANT', 'PlacementDrive'), ctrl.updateApplicantStatus);

module.exports = router;
