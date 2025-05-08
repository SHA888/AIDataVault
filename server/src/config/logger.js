const winston = require('winston');
const path = require('path');

// Define log format
const logFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.printf(info => `${info.timestamp} ${info.level}: ${info.message}`)
);

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info', // Default to 'info', can be set in .env
  format: logFormat,
  transports: [
    // Console transport
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(), // Add colors to console output
        logFormat
      ),
    }),
    // File transport for all logs
    new winston.transports.File({
      filename: path.join(__dirname, '../../logs/app.log'), // Corrected path
      level: 'info', // Log info and above to this file
    }),
    // File transport for error logs
    new winston.transports.File({
      filename: path.join(__dirname, '../../logs/error.log'), // Corrected path
      level: 'error', // Log only errors to this file
    }),
  ],
  exceptionHandlers: [
    // Log unhandled exceptions to a separate file
    new winston.transports.File({ filename: path.join(__dirname, '../../logs/exceptions.log') }) // Corrected path
  ],
  rejectionHandlers: [
    // Log unhandled promise rejections to a separate file
    new winston.transports.File({ filename: path.join(__dirname, '../../logs/rejections.log') }) // Corrected path
  ]
});

module.exports = logger;
