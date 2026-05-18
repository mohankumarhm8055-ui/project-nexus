'use strict';

const cron = require('node-cron');
const logger = require('../config/logger');
const reportJob = require('../jobs/reportJob');
const aiAnalyticsJob = require('../jobs/aiAnalyticsJob');

/**
 * Runs every Sunday at 11:00 PM — generates department reports + AI analysis.
 */
const start = () => {
  cron.schedule('0 23 * * 0', async () => {
    logger.info('Scheduler: Weekly report generation starting...');
    try {
      await reportJob.generateWeeklyReports();
      await aiAnalyticsJob.runFullAnalysis();
      logger.info('Weekly report generation complete');
    } catch (err) {
      logger.error(`Weekly report generation failed: ${err.message}`);
    }
  }, { timezone: 'Asia/Kolkata' });

  logger.info('✅ Scheduler: Weekly report registered (Sunday 11:00 PM IST)');
};

module.exports = { start };
