import { Injectable, LoggerService } from '@nestjs/common';
import { createLogger, format, transports, Logger } from 'winston';

@Injectable()
export class CustomLoggerService implements LoggerService {
  private logger: Logger;

  constructor() {
    this.logger = createLogger({
      level: 'info', // Set the default log level
      format: format.combine(
        format.timestamp(),
        format.printf(({ timestamp, level, message, ...meta }) => {
          // Customize log output format
          const log = `${timestamp} [${level}] ${message}`;
          return meta && Object.keys(meta).length ? `${log} ${JSON.stringify(meta)}` : log;
        })
      ),
      transports: [
        new transports.Console({
          format: format.combine(
            format.colorize(),
            format.simple()
          ),
        }),
        new transports.File({ filename: 'logs/combined.log' }),
        new transports.File({ filename: 'logs/errors.log', level: 'error' }),
      ],
    });
  }

  log(message: any, context?: string) {
    this.logger.info({ message, context });
  }

  error(message: any, trace?: string, context?: string) {
    this.logger.error({ message, trace, context });
  }

  warn(message: any, context?: string) {
    this.logger.warn({ message, context });
  }

  requestLog(req: any) {
    const userId = req.user ? req.user.id : 'anonymous'; // Adjust based on your auth setup
    this.logger.info({
      message: 'Incoming Request',
      userId,
      method: req.method,
      url: req.url,
      headers: req.headers,
      body: req.body,
      query: req.query,
      timestamp: new Date().toISOString(),
    });
  }

  responseLog(res: any, req: any, startTime: [number, number]) {
    const endTime = process.hrtime(startTime);
    const duration = endTime[0] * 1e3 + endTime[1] * 1e-6; // Convert to milliseconds

    this.logger.info({
      message: 'Outgoing Response',
      statusCode: res.statusCode,
      url: req.url,
      responseTime: `${duration.toFixed(2)}ms`,
      timestamp: new Date().toISOString(),
    });
  }
}
