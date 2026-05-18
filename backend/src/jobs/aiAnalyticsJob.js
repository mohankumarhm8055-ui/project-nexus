'use strict';

const logger = require('../config/logger');
const riskPredictor = require('../ai-engine/riskPredictor');
const Department = require('../models/Department');

/**
 * AI analytics job — runs risk analysis for all departments.
 */
class AIAnalyticsJob {
  async runFullAnalysis() {
    logger.info('AI Analytics Job: Starting full institution analysis...');
    const departments = await Department.find({ isActive: true }).lean();

    for (const dept of departments) {
      try {
        const result = await riskPredictor.analyzeDepartment(dept._id.toString());
        logger.info(`AI Analysis done for ${dept.name}: ${JSON.stringify(result)}`);
      } catch (err) {
        logger.error(`AI Analysis failed for ${dept.name}: ${err.message}`);
      }
    }
    logger.info('AI Analytics Job: Completed');
  }
}

module.exports = new AIAnalyticsJob();
