'use strict';

const logger = require('./logger');

let redisClient = null;
let isMockMode = false;

// ── In-memory mock for development without Redis ────────────────────────────
class RedisMock {
  constructor() {
    this._store = new Map();
    this._ttls = new Map();
  }
  async get(key) {
    if (this._ttls.has(key) && Date.now() > this._ttls.get(key)) {
      this._store.delete(key);
      this._ttls.delete(key);
      return null;
    }
    return this._store.get(key) || null;
  }
  async set(key, value, ...args) {
    this._store.set(key, value);
    // Handle EX option
    const exIdx = args.indexOf('EX');
    if (exIdx !== -1 && args[exIdx + 1]) {
      this._ttls.set(key, Date.now() + args[exIdx + 1] * 1000);
    }
    return 'OK';
  }
  async del(...keys) { keys.forEach((k) => this._store.delete(k)); return keys.length; }
  async exists(key) { return this._store.has(key) ? 1 : 0; }
  async keys(pattern) {
    const regex = new RegExp('^' + pattern.replace(/\*/g, '.*') + '$');
    return [...this._store.keys()].filter((k) => regex.test(k));
  }
  async flushall() { this._store.clear(); this._ttls.clear(); return 'OK'; }
  on() { return this; }
}

const connectRedis = async () => {
  if (process.env.REDIS_MOCK === 'true') {
    redisClient = new RedisMock();
    isMockMode = true;
    logger.info('🟡 Redis: Running in MOCK mode (in-memory)');
    return redisClient;
  }

  try {
    const Redis = require('ioredis');
    redisClient = new Redis(process.env.REDIS_URL || 'redis://localhost:6379', {
      maxRetriesPerRequest: 3,
      lazyConnect: true,
      retryStrategy: (times) => {
        if (times > 5) {
          logger.error('Redis: Too many retries. Falling back to mock mode.');
          redisClient = new RedisMock();
          isMockMode = true;
          return null;
        }
        return Math.min(times * 200, 2000);
      },
    });

    redisClient.on('connect', () => logger.info('✅ Redis connected'));
    redisClient.on('error', (err) => logger.warn(`⚠️  Redis error: ${err.message}`));
    await redisClient.connect();
  } catch (err) {
    logger.warn(`⚠️  Redis unavailable, using mock: ${err.message}`);
    redisClient = new RedisMock();
    isMockMode = true;
  }

  return redisClient;
};

const getRedis = () => {
  if (!redisClient) throw new Error('Redis not initialized. Call connectRedis() first.');
  return redisClient;
};

module.exports = { connectRedis, getRedis, isMockMode: () => isMockMode };
