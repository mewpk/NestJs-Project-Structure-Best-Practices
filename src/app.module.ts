import { Module } from '@nestjs/common';
import { PrismaModule } from '@prisma/prisma.module';
import { AppConfigModule } from '@config/config.module';
import { AuthModule } from '@modules/auth/auth.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    PrismaModule,
    AppConfigModule,
    AuthModule,
  ],
  controllers : [AppController ],
  providers: [AppService],
})
export class AppModule {}