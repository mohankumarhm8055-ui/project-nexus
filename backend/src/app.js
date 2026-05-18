'use strict';

require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const compression = require('compression');
const mongoSanitize = require('express-mongo-sanitize');
const morgan = require('morgan');
const path = require('path');

const logger = require('./config/logger');
const { errorHandler, notFoundHandler } = require('./middlewares/error.middleware');
const { generalLimiter } = require('./middlewares/rateLimit.middleware');
const routes = require('./routes/index');

const app = express();

// ── Security middleware ───────────────────────────────────────────────────────
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' }, // Allow file serving
}));

app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// ── Request parsing ───────────────────────────────────────────────────────────
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(compression());

// ── Sanitization ──────────────────────────────────────────────────────────────
app.use(mongoSanitize({ replaceWith: '_' })); // Strip $ and . from user input

// ── Logging ───────────────────────────────────────────────────────────────────
const morganFormat = process.env.NODE_ENV === 'production' ? 'combined' : 'dev';
app.use(morgan(morganFormat, {
  stream: { write: (message) => logger.http(message.trim()) },
}));

// ── Static file serving ───────────────────────────────────────────────────────
app.use('/uploads', express.static(path.join(__dirname, '../src/uploads')));

// ── Rate limiting ─────────────────────────────────────────────────────────────
app.use('/api', generalLimiter);

// ── API routes ────────────────────────────────────────────────────────────────
app.use('/api/v1', routes);

// ── 404 handler ───────────────────────────────────────────────────────────────
app.use(notFoundHandler);

// ── Global error handler ──────────────────────────────────────────────────────
app.use(errorHandler);

module.exports = app;
