/**
 * Professional Logger Utility
 */
const fs = require('fs');
const path = require('path');

class Logger {
  constructor(context = 'App') {
    this.context = context;
    this.colors = {
      reset: '\x1b[0m',
      green: '\x1b[32m',
      yellow: '\x1b[33m',
      red: '\x1b[31m',
      cyan: '\x1b[36m',
      gray: '\x1b[90m',
      blue: '\x1b[34m',
      magenta: '\x1b[35m'
    };
    this.logLevel = process.env.LOG_LEVEL || 'info';
    this.logFile = process.env.LOG_FILE || null;
  }

  _shouldLog(level) {
    const levels = { debug: 0, info: 1, warn: 2, error: 3 };
    return levels[level] >= levels[this.logLevel];
  }

  _formatMessage(level, message, data = null) {
    const timestamp = new Date().toISOString();
    const dataStr = data ? ` ${JSON.stringify(data)}` : '';
    return `[${timestamp}] [${level.toUpperCase()}] [${this.context}] ${message}${dataStr}`;
  }

  _writeToFile(message) {
    if (this.logFile) {
      try {
        const logDir = path.dirname(this.logFile);
        if (!fs.existsSync(logDir)) {
          fs.mkdirSync(logDir, { recursive: true });
        }
        fs.appendFileSync(this.logFile, message + '\n');
      } catch (error) {
        console.error('Failed to write to log file:', error.message);
      }
    }
  }

  debug(message, data = null) {
    if (!this._shouldLog('debug')) return;
    
    const formatted = this._formatMessage('debug', message, data);
    console.log(`${this.colors.gray}${formatted}${this.colors.reset}`);
    this._writeToFile(formatted);
  }

  info(message, data = null) {
    if (!this._shouldLog('info')) return;
    
    const formatted = this._formatMessage('info', message, data);
    console.log(`${this.colors.cyan}${formatted}${this.colors.reset}`);
    this._writeToFile(formatted);
  }

  success(message, data = null) {
    if (!this._shouldLog('info')) return;
    
    const formatted = this._formatMessage('success', message, data);
    console.log(`${this.colors.green}${formatted}${this.colors.reset}`);
    this._writeToFile(formatted);
  }

  warn(message, data = null) {
    if (!this._shouldLog('warn')) return;
    
    const formatted = this._formatMessage('warn', message, data);
    console.warn(`${this.colors.yellow}${formatted}${this.colors.reset}`);
    this._writeToFile(formatted);
  }

  error(message, data = null) {
    if (!this._shouldLog('error')) return;
    
    const formatted = this._formatMessage('error', message, data);
    console.error(`${this.colors.red}${formatted}${this.colors.reset}`);
    this._writeToFile(formatted);
  }

  table(data) {
    console.table(data);
  }

  banner(title) {
    const border = '═'.repeat(title.length + 4);
    console.log(`${this.colors.cyan}
╔${border}╗
║  ${title}  ║
╚${border}╝${this.colors.reset}
`);
  }
}

module.exports = Logger;
