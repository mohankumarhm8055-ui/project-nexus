'use strict';

const { Router } = require('express');
const ctrl = require('../controllers/admin.controller');
const { authenticate } = require('../middlewares/auth.middleware');
const { authorize } = require('../middlewares/role.middleware');
const { auditLogger } = require('../middlewares/audit.middleware');

const router = Router();
router.use(authenticate, authorize('admin', 'super_admin'));

router.get('/dashboard',     ctrl.getDashboard);
router.get('/users',         ctrl.getAllUsers);
router.post('/users',        auditLogger('CREATE_USER', 'User'),   ctrl.createUser);
router.put('/users/:id',     auditLogger('UPDATE_USER', 'User'),   ctrl.updateUser);
router.delete('/users/:id',  auditLogger('DELETE_USER', 'User'),   ctrl.deleteUser);
router.get('/audit-logs',    ctrl.getAuditLogs);
router.get('/departments',   ctrl.getDepartments);
router.post('/departments',  auditLogger('CREATE_DEPT', 'Department'), ctrl.createDepartment);

module.exports = router;
