import { MiddlewareConsumer, Module ,NestModule } from '@nestjs/common';
import { PrismaModule } from '@prisma/prisma.module';
import { AppConfigModule } from 'src/configs/config.module';
import { AuthModule } from '@modules/auth/auth.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DeviceController } from '@modules/device/device.controller';
import { DeviceModule } from '@modules/device/device.module';
import { CustomLoggerService } from 'src/configs/logger.config';
import { RequestLoggerMiddleware } from '@middlewares/request-logger.middleware';

@Module({
  imports: [
    PrismaModule,
    AppConfigModule,
    AuthModule,
    DeviceModule,
  ],
  controllers : [AppController, DeviceController ],
  providers: [AppService,CustomLoggerService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(RequestLoggerMiddleware)
      .forRoutes('*'); // Apply to all routes
  }
}