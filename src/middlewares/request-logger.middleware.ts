
import { Injectable, NestMiddleware } from '@nestjs/common';
import { CustomLoggerService } from 'src/configs/logger.config'; // Adjust the import path according to your project structure

@Injectable()
export class RequestLoggerMiddleware implements NestMiddleware {
  constructor(private readonly logger: CustomLoggerService) {}

  use(req: any, res: any, next: () => void) {
    const startTime = process.hrtime(); // Start the timer for performance measurement

    // Log incoming request details
    this.logger.requestLog(req);

    // Listen for the 'finish' event to log response details
    res.on('finish', () => {
      this.logger.responseLog(res, req, startTime);
    });

    next(); // Proceed to the next middleware or route handler
  }
}
