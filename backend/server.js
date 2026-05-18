'use strict';

require('dotenv').config();
const http = require('http');
const { Server: SocketServer } = require('socket.io');

const app = require('./src/app');
const connectDB = require('./src/config/db');
const { connectRedis } = require('./src/config/redis');
const logger = require('./src/config/logger');
const dailyAttendanceAlert = require('./src/schedulers/dailyAttendanceAlert');
const weeklyReportGen = require('./src/schedulers/weeklyReportGen');

const PORT = process.env.PORT || 5000;

// ── HTTP + Socket.IO Server ───────────────────────────────────────────────────
const httpServer = http.createServer(app);
const io = new SocketServer(httpServer, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true,
  },
});

// ── Socket.IO: In-app real-time notifications ─────────────────────────────────
const connectedUsers = new Map(); // userId → socketId
io.on('connection', (socket) => {
  logger.info(`Socket connected: ${socket.id}`);

  socket.on('authenticate', (userId) => {
    connectedUsers.set(userId, socket.id);
    socket.join(`user:${userId}`);
    logger.info(`User ${userId} authenticated on socket ${socket.id}`);
  });

  socket.on('disconnect', () => {
    for (const [uid, sid] of connectedUsers) {
      if (sid === socket.id) { connectedUsers.delete(uid); break; }
    }
    logger.info(`Socket disconnected: ${socket.id}`);
  });
});

// Export io for use in notification service
app.set('io', io);
app.set('connectedUsers', connectedUsers);

// ── Bootstrap ─────────────────────────────────────────────────────────────────
const bootstrap = async () => {
  try {
    // 1. Connect to databases
    await connectDB();
    await connectRedis();

    // 2. Start schedulers
    dailyAttendanceAlert.start();
    weeklyReportGen.start();

    // 3. Start listening
    httpServer.listen(PORT, () => {
      logger.info('═══════════════════════════════════════════════════════');
      logger.info(`🚀 Nexus Intellect Backend — RUNNING`);
      logger.info(`   Environment : ${process.env.NODE_ENV || 'development'}`);
      logger.info(`   Port        : ${PORT}`);
      logger.info(`   API Base    : http://localhost:${PORT}/api/v1`);
      logger.info(`   Health      : http://localhost:${PORT}/api/v1/health`);
      logger.info('═══════════════════════════════════════════════════════');
    });
  } catch (err) {
    logger.error(`❌ Bootstrap failed: ${err.message}`);
    process.exit(1);
  }
};

// ── Unhandled rejection / uncaught exception guards ───────────────────────────
process.on('unhandledRejection', (reason) => {
  logger.error(`Unhandled Promise Rejection: ${reason}`);
});
process.on('uncaughtException', (err) => {
  logger.error(`Uncaught Exception: ${err.message}`);
  process.exit(1);
});

bootstrap();
