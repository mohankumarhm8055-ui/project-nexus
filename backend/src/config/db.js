'use strict';

const mongoose = require('mongoose');
const logger = require('./logger');

let isConnected = false;

const connectDB = async () => {
  if (isConnected) {
    logger.info('MongoDB: Using existing connection');
    return;
  }

  const options = {
    maxPoolSize: 10,
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
    family: 4,
  };

  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, options);
    isConnected = true;
    logger.info(`✅ MongoDB Connected: ${conn.connection.host} | DB: ${conn.connection.name}`);

    // ── Connection event listeners ──────────────────────────────────────────
    mongoose.connection.on('disconnected', () => {
      isConnected = false;
      logger.warn('⚠️  MongoDB disconnected. Attempting reconnect...');
    });

    mongoose.connection.on('reconnected', () => {
      isConnected = true;
      logger.info('✅ MongoDB reconnected');
    });

    mongoose.connection.on('error', (err) => {
      logger.error(`❌ MongoDB connection error: ${err.message}`);
    });

    // ── Graceful shutdown ───────────────────────────────────────────────────
    process.on('SIGINT', async () => {
      await mongoose.connection.close();
      logger.info('MongoDB connection closed due to app termination');
      process.exit(0);
    });

  } catch (error) {
    logger.error(`❌ MongoDB connection failed: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
