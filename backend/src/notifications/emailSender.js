'use strict';

const nodemailer = require('nodemailer');
const logger = require('../config/logger');

let transporter = null;

const getTransporter = () => {
  if (transporter) return transporter;
  transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT) || 587,
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
    pool: true,
    maxConnections: 5,
  });
  return transporter;
};

const send = async ({ to, subject, html, text }) => {
  if (process.env.NOTIFICATION_DRY_RUN === 'true') {
    logger.info(`[DRY RUN] Email to ${to}: ${subject}`);
    return { messageId: 'dry-run-' + Date.now() };
  }

  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    logger.warn('Email not configured — skipping');
    return null;
  }

  try {
    const info = await getTransporter().sendMail({
      from: process.env.SMTP_FROM || '"Nexus Intellect" <noreply@nexus.edu>',
      to,
      subject,
      html,
      text,
    });
    logger.info(`Email sent to ${to}: ${info.messageId}`);
    return info;
  } catch (err) {
    logger.error(`Email send failed to ${to}: ${err.message}`);
    throw err;
  }
};

const sendTemplate = async ({ to, subject, template, data }) => {
  const html = buildTemplate(template, data);
  return send({ to, subject, html });
};

const buildTemplate = (type, data) => {
  const templates = {
    absenceAlert: `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;background:#f8fafc;padding:20px;border-radius:12px">
        <div style="background:#4F46E5;color:#fff;padding:20px;border-radius:8px;text-align:center">
          <h2>⚠️ Attendance Alert</h2>
          <p>Nexus Intellect Academic System</p>
        </div>
        <div style="padding:24px;background:#fff;margin-top:12px;border-radius:8px">
          <p>Dear <strong>${data.parentName || 'Parent/Guardian'}</strong>,</p>
          <p>This is to inform you that <strong>${data.studentName}</strong> (USN: ${data.usn}) 
          was marked <span style="color:#EF4444;font-weight:bold">ABSENT</span> 
          on <strong>${data.date}</strong> for <strong>${data.subject}</strong>.</p>
          <p>Please ensure regular attendance to avoid academic penalties.</p>
          <hr style="border:none;border-top:1px solid #e2e8f0">
          <p style="color:#64748b;font-size:12px">This is an automated message from Nexus Intellect Academic OS.</p>
        </div>
      </div>`,
    lowMarks: `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;background:#f8fafc;padding:20px;border-radius:12px">
        <div style="background:#F59E0B;color:#fff;padding:20px;border-radius:8px;text-align:center">
          <h2>📊 Academic Performance Alert</h2>
        </div>
        <div style="padding:24px;background:#fff;margin-top:12px;border-radius:8px">
          <p>Dear <strong>${data.parentName || 'Parent/Guardian'}</strong>,</p>
          <p><strong>${data.studentName}</strong> has scored below the minimum threshold 
          in <strong>${data.assessmentType}</strong>. 
          Please encourage them to seek faculty assistance.</p>
        </div>
      </div>`,
  };
  return templates[type] || `<p>${JSON.stringify(data)}</p>`;
};

module.exports = { send, sendTemplate };
