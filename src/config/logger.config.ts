import { Injectable, LoggerService } from '@nestjs/common';
import { createLogger, format, transports, Logger } from 'winston';

@Injectable()
export class CustomLoggerService implements LoggerService {
  private logger: Logger;

  constructor() {
    this.logger = createLogger({
      level: 'info',
      format: format.combine(
        format.timestamp(),
        format.json(),
      ),
      transports: [
        new transports.Console(),
        new transports.File({ filename: 'combined.log' }),
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


}
