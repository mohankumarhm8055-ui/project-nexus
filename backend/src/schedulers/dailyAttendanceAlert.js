'use strict';

const cron = require('node-cron');
const logger = require('../config/logger');
const attendanceService = require('../services/attendance.service');
const Department = require('../models/Department');

/**
 * Runs every day at 6:00 PM.
 * Scans all departments for low attendance students and sends parent alerts.
 */
const start = () => {
  cron.schedule('0 18 * * 1-6', async () => {
    logger.info('Scheduler: Daily attendance alert job starting...');
    try {
      const departments = await Department.find({ isActive: true }).lean();
      let totalAlerted = 0;
      for (const dept of departments) {
        const lowStudents = await attendanceService.getLowAttendanceStudents(dept._id.toString(), 75);
        totalAlerted += lowStudents.length;
        logger.info(`Dept ${dept.name}: ${lowStudents.length} students with low attendance`);
      }
      logger.info(`Daily attendance alert complete. Total students alerted: ${totalAlerted}`);
    } catch (err) {
      logger.error(`Daily attendance alert failed: ${err.message}`);
    }
  }, { timezone: 'Asia/Kolkata' });

  logger.info('✅ Scheduler: Daily attendance alert registered (6:00 PM IST, Mon-Sat)');
};

module.exports = { start };
