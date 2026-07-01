import winston from 'winston';
import 'winston-daily-rotate-file';

const { combine, timestamp, json, errors } = winston.format;

// Define custom levels and colors (optional, but good for local dev)
const customLevels = {
  levels: {
    error: 0,
    warn: 1,
    info: 2,
    http: 3,
    debug: 4,
  },
  colors: {
    error: 'red',
    warn: 'yellow',
    info: 'green',
    http: 'magenta',
    debug: 'white',
  },
};

winston.addColors(customLevels.colors);

// Configure file transport for rotating logs
const fileRotateTransport = new winston.transports.DailyRotateFile({
  filename: 'logs/cgms-%DATE%.log',
  datePattern: 'YYYY-MM-DD',
  maxFiles: '14d',
  maxSize: '20m',
});

// Configure error file transport
const errorFileRotateTransport = new winston.transports.DailyRotateFile({
  level: 'error',
  filename: 'logs/cgms-error-%DATE%.log',
  datePattern: 'YYYY-MM-DD',
  maxFiles: '30d',
  maxSize: '20m',
});

// Create the logger instance
export const logger = winston.createLogger({
  level: process.env.NODE_ENV === 'development' ? 'debug' : 'info',
  levels: customLevels.levels,
  format: combine(
    errors({ stack: true }), // capture stack trace
    timestamp(),
    json() // structured JSON logging
  ),
  transports: [
    fileRotateTransport,
    errorFileRotateTransport,
  ],
  exceptionHandlers: [
    new winston.transports.File({ filename: 'logs/exceptions.log' }),
  ],
  rejectionHandlers: [
    new winston.transports.File({ filename: 'logs/rejections.log' }),
  ],
});

// In development, also log to console in a readable format
if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.combine(
      winston.format.colorize({ all: true }),
      winston.format.simple()
    ),
  }));
} else {
  // In production, we also want console logs so Docker/stdout captures them, but as JSON
  logger.add(new winston.transports.Console({
    format: winston.format.combine(
      timestamp(),
      json()
    )
  }));
}
