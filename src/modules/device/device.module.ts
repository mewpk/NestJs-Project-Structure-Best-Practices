import { Module } from '@nestjs/common';
import { DeviceController } from './device.controller';
import { DeviceService } from './device.service';
import { PrismaService } from '@prisma/prisma.service';
import { RedisService } from 'src/configs/redis.config';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule],
  controllers: [DeviceController],
  providers: [DeviceService,PrismaService, RedisService],
  exports: [DeviceService],
})
export class DeviceModule {}
