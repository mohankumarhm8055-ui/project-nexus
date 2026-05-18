'use strict';

const { createLogger, format, transports } = require('winston');
const DailyRotateFile = require('winston-daily-rotate-file');
const path = require('path');
const fs = require('fs');

const LOG_DIR = path.join(__dirname, '../../', process.env.LOG_DIR || 'src/logs');
if (!fs.existsSync(LOG_DIR)) fs.mkdirSync(LOG_DIR, { recursive: true });

const { combine, timestamp, errors, json, colorize, printf } = format;

// ── Console format for development ──────────────────────────────────────────
const consoleFormat = printf(({ level, message, timestamp, stack }) => {
  return `${timestamp} [${level}]: ${stack || message}`;
});

// ── File transports ──────────────────────────────────────────────────────────
const dailyRotateError = new DailyRotateFile({
  filename: path.join(LOG_DIR, 'error-%DATE%.log'),
  datePattern: 'YYYY-MM-DD',
  level: 'error',
  maxSize: '20m',
  maxFiles: '30d',
  zippedArchive: true,
});

const dailyRotateCombined = new DailyRotateFile({
  filename: path.join(LOG_DIR, 'combined-%DATE%.log'),
  datePattern: 'YYYY-MM-DD',
  maxSize: '20m',
  maxFiles: '14d',
  zippedArchive: true,
});

const logger = createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: combine(
    timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    errors({ stack: true }),
    json()
  ),
  transports: [dailyRotateError, dailyRotateCombined],
  exitOnError: false,
});

// ── Add console transport in development ─────────────────────────────────────
if (process.env.NODE_ENV !== 'production') {
  logger.add(
    new transports.Console({
      format: combine(
        colorize({ all: true }),
        timestamp({ format: 'HH:mm:ss' }),
        errors({ stack: true }),
        consoleFormat
      ),
    })
  );
}

module.exports = logger;
