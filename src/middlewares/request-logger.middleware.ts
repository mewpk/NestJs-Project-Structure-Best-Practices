import { Injectable, NestMiddleware } from '@nestjs/common';
import { CustomLoggerService } from '@config/logger.config';

@Injectable()
export class RequestLoggerMiddleware implements NestMiddleware {
  constructor(private readonly logger: CustomLoggerService) {}

  use(req: any, res: any, next: () => void) {
    const { method, url } = req;
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;

    this.logger.log(`Incoming Request: ${method} ${url} from ${ip}`);

    res.on('finish', () => {
      const { statusCode } = res;
      this.logger.log(`Response: ${statusCode} for ${method} ${url} from ${ip}`);
    });

    next();
  }
}
