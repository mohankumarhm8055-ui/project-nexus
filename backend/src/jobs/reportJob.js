'use strict';

const logger = require('../config/logger');
const reportService = require('../services/report.service');
const Department = require('../models/Department');

class ReportJob {
  async generateWeeklyReports() {
    logger.info('Report Job: Generating weekly department reports...');
    const departments = await Department.find({ isActive: true }).lean();
    const academicYear = this._currentAcademicYear();

    for (const dept of departments) {
      try {
        await reportService.generateDepartmentExcel(dept._id.toString(), { semester: 5, academicYear });
        logger.info(`Weekly report generated for ${dept.name}`);
      } catch (err) {
        logger.error(`Weekly report failed for ${dept.name}: ${err.message}`);
      }
    }
  }

  _currentAcademicYear() {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() + 1;
    return month >= 6 ? `${year}-${String(year + 1).slice(-2)}` : `${year - 1}-${String(year).slice(-2)}`;
  }
}

module.exports = new ReportJob();
