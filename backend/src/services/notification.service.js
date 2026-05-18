'use strict';

const Notification = require('../models/Notification');
const Student = require('../models/Student');
const emailSender = require('../notifications/emailSender');
const smsSender = require('../notifications/smsSender');
const pushSender = require('../notifications/pushSender');
const logger = require('../config/logger');

class NotificationService {
  // ── Generic send ──────────────────────────────────────────────────────────
  async send({ recipientId, recipientRole, senderId, senderRole, channel, title, body, category, scheduledFor, metadata }) {
    const notif = await Notification.create({
      recipient: recipientId,
      recipientRole,
      sender: senderId,
      senderRole,
      channel,
      title,
      body,
      category: category || 'general',
      scheduledFor,
      metadata,
      status: scheduledFor ? 'pending' : 'sent',
    });

    if (!scheduledFor) {
      await this._dispatch(notif);
    }

    return notif;
  }

  // ── Dispatch to the right channel ────────────────────────────────────────
  async _dispatch(notif) {
    try {
      switch (notif.channel) {
        case 'email':
          await emailSender.send({ to: notif.metadata?.email, subject: notif.title, html: notif.body });
          break;
        case 'sms':
          await smsSender.send({ to: notif.metadata?.phone, message: notif.body });
          break;
        case 'whatsapp':
          await smsSender.sendWhatsApp({ to: notif.metadata?.phone, message: notif.body });
          break;
        case 'push':
          await pushSender.send({ token: notif.metadata?.pushToken, title: notif.title, body: notif.body });
          break;
        case 'in_app':
          // In-app handled by Socket.IO (see server.js)
          break;
        default:
          logger.warn(`Unknown notification channel: ${notif.channel}`);
      }
      await Notification.findByIdAndUpdate(notif._id, { status: 'delivered', deliveredAt: new Date() });
    } catch (err) {
      logger.error(`Notification dispatch failed [${notif._id}]: ${err.message}`);
      await Notification.findByIdAndUpdate(notif._id, {
        status: 'failed',
        failureReason: err.message,
        $inc: { retryCount: 1 },
      });
    }
  }

  // ── Parent absence alert ──────────────────────────────────────────────────
  async sendParentAbsenceAlert(student, { subject, date }) {
    if (!student.parentId) return;
    const parent = student.parentId;
    const subjectName = typeof subject === 'object' ? subject.name : 'a subject';
    const dateStr = new Date(date).toLocaleDateString('en-IN');

    const channels = parent.preferredNotification || ['sms'];
    for (const ch of channels) {
      await this.send({
        recipientId: parent.userId || parent._id,
        recipientRole: 'parent',
        channel: ch,
        title: `Attendance Alert — ${student.name}`,
        body: `Your ward ${student.name} (${student.usn}) was marked ABSENT for ${subjectName} on ${dateStr}.`,
        category: 'attendance',
        metadata: { email: parent.email, phone: parent.phone || parent.whatsappPhone },
      }).catch((e) => logger.warn(`Alert send failed: ${e.message}`));
    }
  }

  // ── Low marks alert ───────────────────────────────────────────────────────
  async sendLowMarksAlert(studentIds, { subject, type, maxMarks }) {
    const students = await Student.find({ _id: { $in: studentIds } }).populate('parentId').lean();
    for (const student of students) {
      if (!student.parentId) continue;
      await this.send({
        recipientId: student.parentId.userId || student.parentId._id,
        recipientRole: 'parent',
        channel: 'in_app',
        title: `Low Performance Alert — ${student.name}`,
        body: `${student.name} has scored below 40% in ${type} assessment. Please encourage them to improve.`,
        category: 'marks',
        metadata: { email: student.parentId.email, phone: student.parentId.phone },
      }).catch((e) => logger.warn(`Low marks alert failed: ${e.message}`));
    }
  }

  // ── Get notifications for a user ──────────────────────────────────────────
  async getUserNotifications(userId, { page = 1, limit = 20, unreadOnly = false } = {}) {
    const filter = { recipient: userId };
    if (unreadOnly) filter.isRead = false;
    const skip = (page - 1) * limit;
    const [notifications, total] = await Promise.all([
      Notification.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
      Notification.countDocuments(filter),
    ]);
    return { notifications, total, unreadCount: await Notification.countDocuments({ recipient: userId, isRead: false }) };
  }

  // ── Mark notifications as read ────────────────────────────────────────────
  async markAsRead(userId, notifIds) {
    return Notification.updateMany(
      { _id: { $in: notifIds }, recipient: userId },
      { isRead: true, readAt: new Date(), status: 'read' }
    );
  }
}

module.exports = new NotificationService();
