import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { RedisService } from './redis.config';

@Module({
  imports: [],
  providers: [PrismaService, RedisService],
  exports: [PrismaService, RedisService],
})
export class AppConfigModule {}