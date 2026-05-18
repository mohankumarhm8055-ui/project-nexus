'use strict';

const { Router } = require('express');
const authController = require('../controllers/auth.controller');
const { validate } = require('../middlewares/validate.middleware');
const { authenticate } = require('../middlewares/auth.middleware');
const { authLimiter } = require('../middlewares/rateLimit.middleware');
const { auditLogger } = require('../middlewares/audit.middleware');
const { loginSchema, registerSchema, refreshTokenSchema, forgotPasswordSchema, resetPasswordSchema } = require('../validations/auth.validation');

const router = Router();

router.post('/login',    authLimiter, validate(loginSchema),         auditLogger('LOGIN', 'User'),    authController.login);
router.post('/register', authLimiter, validate(registerSchema),       auditLogger('REGISTER', 'User'), authController.register);
router.post('/refresh-token', validate(refreshTokenSchema),           authController.refreshToken);
router.post('/logout',   authenticate,                                auditLogger('LOGOUT', 'User'),   authController.logout);
router.get('/me',        authenticate,                                authController.getMe);
router.post('/forgot-password', authLimiter, validate(forgotPasswordSchema), authController.forgotPassword);
router.post('/reset-password',  authLimiter, validate(resetPasswordSchema),  authController.resetPassword);

module.exports = router;
