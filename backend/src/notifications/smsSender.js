'use strict';

const logger = require('../config/logger');

let twilioClient = null;

const getClient = () => {
  if (twilioClient) return twilioClient;
  if (!process.env.TWILIO_ACCOUNT_SID || !process.env.TWILIO_AUTH_TOKEN) return null;
  try {
    const twilio = require('twilio');
    twilioClient = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
  } catch (e) {
    logger.warn('Twilio module not available');
  }
  return twilioClient;
};

const send = async ({ to, message }) => {
  if (process.env.NOTIFICATION_DRY_RUN === 'true') {
    logger.info(`[DRY RUN] SMS to ${to}: ${message.substring(0, 60)}...`);
    return { sid: 'dry-run-sms-' + Date.now() };
  }

  const client = getClient();
  if (!client) {
    logger.warn(`SMS not sent to ${to} — Twilio not configured`);
    return null;
  }

  try {
    const msg = await client.messages.create({
      body: message,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: to.startsWith('+') ? to : `+91${to}`,
    });
    logger.info(`SMS sent to ${to}: ${msg.sid}`);
    return msg;
  } catch (err) {
    logger.error(`SMS failed to ${to}: ${err.message}`);
    throw err;
  }
};

const sendWhatsApp = async ({ to, message }) => {
  if (process.env.NOTIFICATION_DRY_RUN === 'true') {
    logger.info(`[DRY RUN] WhatsApp to ${to}: ${message.substring(0, 60)}...`);
    return { sid: 'dry-run-wa-' + Date.now() };
  }

  const client = getClient();
  if (!client) {
    logger.warn(`WhatsApp not sent to ${to} — Twilio not configured`);
    return null;
  }

  try {
    const formattedTo = `whatsapp:${to.startsWith('+') ? to : `+91${to}`}`;
    const msg = await client.messages.create({
      body: message,
      from: process.env.TWILIO_WHATSAPP_NUMBER || 'whatsapp:+14155238886',
      to: formattedTo,
    });
    logger.info(`WhatsApp sent to ${to}: ${msg.sid}`);
    return msg;
  } catch (err) {
    logger.error(`WhatsApp failed to ${to}: ${err.message}`);
    throw err;
  }
};

module.exports = { send, sendWhatsApp };
