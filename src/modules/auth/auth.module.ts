import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PrismaModule } from '../../prisma/prisma.module';
import { RedisService } from '../../config/redis.config';

@Module({
  imports: [PrismaModule],
  controllers: [AuthController],
  providers: [AuthService, RedisService],
})
export class AuthModule {}