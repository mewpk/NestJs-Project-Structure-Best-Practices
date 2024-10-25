import { Module } from '@nestjs/common';
import { DeviceController } from './device.controller';
import { DeviceService } from './device.service';
import { PrismaService } from '@prisma/prisma.service';
import { RedisService } from '@config/redis.config';

@Module({
  controllers: [DeviceController],
  providers: [DeviceService,PrismaService, RedisService],
  exports: [DeviceService],
})
export class DeviceModule {}
