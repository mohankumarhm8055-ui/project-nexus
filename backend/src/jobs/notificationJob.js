'use strict';

const logger = require('../config/logger');
const notificationService = require('../services/notification.service');
const Notification = require('../models/Notification');

/**
 * Bull-based notification job processor.
 * Falls back to direct processing if Bull/Redis unavailable.
 */
class NotificationJobProcessor {
  constructor() {
    this.queue = null;
    this._initQueue();
  }

  _initQueue() {
    try {
      if (process.env.REDIS_MOCK === 'true') {
        logger.info('NotificationJob: Running in direct mode (no Bull queue)');
        return;
      }
      const Bull = require('bull');
      this.queue = new Bull('notifications', { redis: process.env.REDIS_URL || 'redis://localhost:6379' });
      this.queue.process(5, this._processJob.bind(this));
      this.queue.on('completed', (job) => logger.info(`Notification job ${job.id} completed`));
      this.queue.on('failed', (job, err) => logger.error(`Notification job ${job.id} failed: ${err.message}`));
      logger.info('Notification queue initialized');
    } catch (err) {
      logger.warn(`Bull queue unavailable: ${err.message}. Using direct processing.`);
    }
  }

  async enqueue(data) {
    if (this.queue) {
      return this.queue.add(data, { attempts: 3, backoff: { type: 'exponential', delay: 2000 }, removeOnComplete: 100 });
    }
    // Direct processing fallback
    return this._processJob({ data });
  }

  async _processJob(job) {
    const { notifId } = job.data;
    try {
      const notif = await Notification.findById(notifId);
      if (!notif) return;
      await notificationService._dispatch(notif);
    } catch (err) {
      logger.error(`Notification processing error [${notifId}]: ${err.message}`);
      throw err;
    }
  }

  // ── Retry failed notifications ────────────────────────────────────────────
  async retryFailed() {
    const failed = await Notification.find({ status: 'failed', retryCount: { $lt: 3 } });
    logger.info(`Retrying ${failed.length} failed notifications`);
    for (const notif of failed) {
      await this.enqueue({ notifId: notif._id.toString() });
    }
  }
}

module.exports = new NotificationJobProcessor();
