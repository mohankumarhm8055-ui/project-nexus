'use strict';

const logger = require('../config/logger');

/**
 * Push notification sender.
 * In production, integrate Firebase Admin SDK (FCM) or OneSignal.
 * Currently logs in dry-run / no-config mode.
 */
const send = async ({ token, title, body, data = {} }) => {
  if (process.env.NOTIFICATION_DRY_RUN === 'true' || !process.env.FCM_SERVER_KEY) {
    logger.info(`[DRY RUN] Push notification: "${title}" → token:${token?.substring(0, 20)}...`);
    return { success: true, mode: 'dry-run' };
  }

  // ── Firebase Admin SDK integration stub ───────────────────────────────────
  // const admin = require('firebase-admin');
  // const message = { token, notification: { title, body }, data };
  // const response = await admin.messaging().send(message);
  // logger.info(`Push sent: ${response}`);
  // return response;

  logger.info(`Push notification: ${title} to token ${token?.substring(0, 20)}`);
  return { success: true };
};

/**
 * Send push notification to multiple tokens.
 */
const sendMulticast = async ({ tokens, title, body, data = {} }) => {
  if (!tokens?.length) return;
  const ops = tokens.map((token) => send({ token, title, body, data }));
  return Promise.allSettled(ops);
};

module.exports = { send, sendMulticast };
