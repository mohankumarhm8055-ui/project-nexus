'use strict';

const asyncHandler = require('../utils/asyncHandler');
const ApiResponse = require('../utils/ApiResponse');
const notificationService = require('../services/notification.service');

// POST /api/v1/notifications/send
const sendNotification = asyncHandler(async (req, res) => {
  const { recipientId, recipientRole, channel, title, body, category, scheduledFor, metadata } = req.body;
  const notif = await notificationService.send({
    recipientId, recipientRole,
    senderId: req.user._id, senderRole: req.user.role,
    channel, title, body, category, scheduledFor, metadata,
  });
  ApiResponse.created(res, 'Notification sent', notif);
});

// GET /api/v1/notifications
const getMyNotifications = asyncHandler(async (req, res) => {
  const { page, limit, unreadOnly } = req.query;
  const data = await notificationService.getUserNotifications(
    req.user._id, { page: parseInt(page) || 1, limit: parseInt(limit) || 20, unreadOnly: unreadOnly === 'true' }
  );
  ApiResponse.success(res, 'Notifications fetched', data);
});

// PUT /api/v1/notifications/read
const markAsRead = asyncHandler(async (req, res) => {
  const { ids } = req.body; // array of notification IDs
  await notificationService.markAsRead(req.user._id, ids);
  ApiResponse.success(res, 'Marked as read');
});

// PUT /api/v1/notifications/read-all
const markAllAsRead = asyncHandler(async (req, res) => {
  const { Notification } = require('../models/Notification');
  const ids = (await require('../models/Notification').find({ recipient: req.user._id, isRead: false }).select('_id').lean()).map((n) => n._id);
  await notificationService.markAsRead(req.user._id, ids);
  ApiResponse.success(res, 'All notifications marked as read');
});

module.exports = { sendNotification, getMyNotifications, markAsRead, markAllAsRead };
