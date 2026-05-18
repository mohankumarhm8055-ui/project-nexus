'use strict';

const asyncHandler = require('../utils/asyncHandler');
const ApiResponse = require('../utils/ApiResponse');
const ApiError = require('../utils/ApiError');
const User = require('../models/User');
const Student = require('../models/Student');
const Faculty = require('../models/Faculty');
const Department = require('../models/Department');
const AIAnalytics = require('../models/AIAnalytics');
const AuditLog = require('../models/AuditLog');
const { paginate } = require('../utils/pagination');
const cache = require('../services/cache.service');

// GET /api/v1/admin/dashboard
const getDashboard = asyncHandler(async (req, res) => {
  const data = await cache.getOrSet('admin:dashboard', async () => {
    const [totalUsers, totalStudents, totalFaculty, totalDepts, atRisk, totalAlerts] = await Promise.all([
      User.countDocuments({ isActive: true }),
      Student.countDocuments({ isActive: true }),
      Faculty.countDocuments({ isActive: true }),
      Department.countDocuments({ isActive: true }),
      AIAnalytics.countDocuments({ riskLevel: { $in: ['high', 'critical'] } }),
      AuditLog.countDocuments({ createdAt: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) } }),
    ]);
    return { totalUsers, totalStudents, totalFaculty, totalDepts, atRiskStudents: atRisk, activityLast24h: totalAlerts };
  }, 60);
  ApiResponse.success(res, 'Admin dashboard fetched', data);
});

// GET /api/v1/admin/users
const getAllUsers = asyncHandler(async (req, res) => {
  const { role, search, isActive = true } = req.query;
  const filter = { isActive: isActive === 'false' ? false : true };
  if (role) filter.role = role;
  if (search) filter.$or = [
    { name: { $regex: search, $options: 'i' } },
    { email: { $regex: search, $options: 'i' } },
  ];
  const total = await User.countDocuments(filter);
  const { skip, limit, meta } = paginate(req.query, total);
  const users = await User.find(filter).skip(skip).limit(limit).sort({ createdAt: -1 });
  ApiResponse.paginated(res, 'Users fetched', users, meta);
});

// POST /api/v1/admin/users
const createUser = asyncHandler(async (req, res) => {
  const existing = await User.findOne({ email: req.body.email });
  if (existing) throw ApiError.conflict('Email already exists');
  const user = await User.create({ ...req.body, passwordHash: req.body.password });
  ApiResponse.created(res, 'User created', user.toSafeObject());
});

// PUT /api/v1/admin/users/:id
const updateUser = asyncHandler(async (req, res) => {
  const allowed = ['name', 'phone', 'isActive', 'role'];
  const updates = {};
  allowed.forEach((k) => { if (req.body[k] !== undefined) updates[k] = req.body[k]; });
  const user = await User.findByIdAndUpdate(req.params.id, updates, { new: true });
  if (!user) throw ApiError.notFound('User not found');
  ApiResponse.success(res, 'User updated', user.toSafeObject());
});

// DELETE /api/v1/admin/users/:id (soft delete)
const deleteUser = asyncHandler(async (req, res) => {
  await User.softDelete(req.params.id);
  cache.invalidatePattern('admin:*');
  ApiResponse.success(res, 'User deactivated successfully');
});

// GET /api/v1/admin/audit-logs
const getAuditLogs = asyncHandler(async (req, res) => {
  const { action, userId, from, to } = req.query;
  const filter = {};
  if (action) filter.action = action;
  if (userId) filter.user = userId;
  if (from || to) filter.createdAt = {};
  if (from) filter.createdAt.$gte = new Date(from);
  if (to) filter.createdAt.$lte = new Date(to);

  const total = await AuditLog.countDocuments(filter);
  const { skip, limit, meta } = paginate(req.query, total);
  const logs = await AuditLog.find(filter)
    .populate('user', 'name email role')
    .sort({ createdAt: -1 })
    .skip(skip).limit(limit)
    .lean();
  ApiResponse.paginated(res, 'Audit logs fetched', logs, meta);
});

// GET /api/v1/admin/departments
const getDepartments = asyncHandler(async (req, res) => {
  const depts = await Department.find({ isActive: true }).populate('hodId', 'name employeeId').lean();
  ApiResponse.success(res, 'Departments fetched', depts);
});

// POST /api/v1/admin/departments
const createDepartment = asyncHandler(async (req, res) => {
  const dept = await Department.create(req.body);
  ApiResponse.created(res, 'Department created', dept);
});

module.exports = { getDashboard, getAllUsers, createUser, updateUser, deleteUser, getAuditLogs, getDepartments, createDepartment };
