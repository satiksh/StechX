// Logging utility for API routes and client-side operations

export enum LogLevel {
  DEBUG = 'DEBUG',
  INFO = 'INFO',
  WARN = 'WARN',
  ERROR = 'ERROR',
}

interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  data?: any;
  userId?: string;
  endpoint?: string;
  statusCode?: number;
}

class Logger {
  private isDevelopment = process.env.NODE_ENV === 'development';

  private formatLog(entry: LogEntry): string {
    const { timestamp, level, message, data, userId, endpoint, statusCode } = entry;
    let log = `[${timestamp}] [${level}]`;
    
    if (userId) log += ` [User: ${userId}]`;
    if (endpoint) log += ` [${endpoint}]`;
    if (statusCode) log += ` [Status: ${statusCode}]`;
    
    log += ` ${message}`;
    if (data) log += ` ${JSON.stringify(data)}`;
    
    return log;
  }

  private log(level: LogLevel, message: string, data?: any, context?: any) {
    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      message,
      data,
      ...context,
    };

    const formatted = this.formatLog(entry);

    if (this.isDevelopment || level === LogLevel.ERROR) {
      const consoleMethod = level === LogLevel.ERROR ? 'error' : 'log';
      console[consoleMethod as 'log' | 'error'](formatted);
    }

    // In production, you can send logs to external service (e.g., Sentry, LogRocket)
    if (!this.isDevelopment && level === LogLevel.ERROR) {
      this.sendToExternalService(entry);
    }
  }

  private sendToExternalService(entry: LogEntry) {
    // TODO: Implement external logging service
    // e.g., Sentry.captureException, LogRocket.captureException, etc.
  }

  debug(message: string, data?: any, context?: any) {
    this.log(LogLevel.DEBUG, message, data, context);
  }

  info(message: string, data?: any, context?: any) {
    this.log(LogLevel.INFO, message, data, context);
  }

  warn(message: string, data?: any, context?: any) {
    this.log(LogLevel.WARN, message, data, context);
  }

  error(message: string, data?: any, context?: any) {
    this.log(LogLevel.ERROR, message, data, context);
  }

  apiCall(method: string, endpoint: string, userId?: string, statusCode?: number) {
    this.log(LogLevel.INFO, `${method} ${endpoint}`, undefined, {
      userId,
      endpoint,
      statusCode,
    });
  }

  userAction(action: string, userId: string, data?: any) {
    this.log(LogLevel.INFO, `User action: ${action}`, data, { userId });
  }

  businessEvent(event: string, data?: any) {
    this.log(LogLevel.INFO, `Business event: ${event}`, data);
  }
}

export const logger = new Logger();
