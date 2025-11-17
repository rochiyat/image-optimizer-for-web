/**
 * Centralized Error Handling
 */

class AppError extends Error {
  constructor(message, statusCode = 500, isOperational = true) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    this.timestamp = new Date().toISOString();
    
    Error.captureStackTrace(this, this.constructor);
  }
}

class ValidationError extends AppError {
  constructor(message) {
    super(message, 400);
    this.name = 'ValidationError';
  }
}

class NotFoundError extends AppError {
  constructor(message = 'Resource not found') {
    super(message, 404);
    this.name = 'NotFoundError';
  }
}

class ProcessingError extends AppError {
  constructor(message) {
    super(message, 500);
    this.name = 'ProcessingError';
  }
}

class ErrorHandler {
  static handle(error, logger) {
    if (error.isOperational) {
      logger.error(error.message, {
        statusCode: error.statusCode,
        timestamp: error.timestamp
      });
    } else {
      logger.error('Unexpected error occurred', {
        error: error.message,
        stack: error.stack
      });
    }

    return {
      success: false,
      error: {
        message: error.message,
        statusCode: error.statusCode || 500,
        timestamp: error.timestamp || new Date().toISOString()
      }
    };
  }

  static async handleAsync(fn, logger) {
    try {
      return await fn();
    } catch (error) {
      return this.handle(error, logger);
    }
  }
}

module.exports = {
  AppError,
  ValidationError,
  NotFoundError,
  ProcessingError,
  ErrorHandler
};
