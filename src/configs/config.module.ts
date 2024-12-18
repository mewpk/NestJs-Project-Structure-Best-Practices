import { Module } from '@nestjs/common';
import { PrismaService } from '@prisma/prisma.service';
import { RedisService } from 'src/configs/redis.config';
import { CustomLoggerService } from 'src/configs/logger.config';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule],
  providers: [PrismaService, RedisService, CustomLoggerService],
  exports: [PrismaService, RedisService, CustomLoggerService],
})
export class AppConfigModule { }