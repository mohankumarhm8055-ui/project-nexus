'use strict';

const { getRedis } = require('../config/redis');
const logger = require('../config/logger');

const DEFAULT_TTL = 300; // 5 minutes

class CacheService {
  get redis() {
    return getRedis();
  }

  async get(key) {
    try {
      const data = await this.redis.get(key);
      return data ? JSON.parse(data) : null;
    } catch (err) {
      logger.warn(`Cache GET failed [${key}]: ${err.message}`);
      return null;
    }
  }

  async set(key, value, ttlSeconds = DEFAULT_TTL) {
    try {
      await this.redis.set(key, JSON.stringify(value), 'EX', ttlSeconds);
    } catch (err) {
      logger.warn(`Cache SET failed [${key}]: ${err.message}`);
    }
  }

  async del(key) {
    try {
      await this.redis.del(key);
    } catch (err) {
      logger.warn(`Cache DEL failed [${key}]: ${err.message}`);
    }
  }

  async invalidatePattern(pattern) {
    try {
      const keys = await this.redis.keys(pattern);
      if (keys.length > 0) await this.redis.del(...keys);
      return keys.length;
    } catch (err) {
      logger.warn(`Cache invalidate failed [${pattern}]: ${err.message}`);
      return 0;
    }
  }

  // ── Wrapper: get from cache or compute and cache ──────────────────────────
  async getOrSet(key, fetchFn, ttlSeconds = DEFAULT_TTL) {
    const cached = await this.get(key);
    if (cached !== null) return cached;
    const fresh = await fetchFn();
    if (fresh !== null && fresh !== undefined) await this.set(key, fresh, ttlSeconds);
    return fresh;
  }

  // ── Predefined cache key generators ──────────────────────────────────────
  keys = {
    studentSummary: (id) => `student:${id}:summary`,
    attendanceSummary: (studentId) => `attendance:${studentId}:summary`,
    hodDashboard: (deptId) => `hod:${deptId}:dashboard`,
    aiAnalytics: (studentId) => `ai:${studentId}:analytics`,
    subjectList: (deptId, sem) => `subjects:${deptId}:sem${sem}`,
    placementStats: () => `placement:stats`,
  };
}

module.exports = new CacheService();
