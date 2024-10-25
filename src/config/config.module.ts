import { Module } from '@nestjs/common';
import { PrismaService } from '@prisma/prisma.service';
import { RedisService } from '@config/redis.config';


@Module({
  imports: [],
  providers: [PrismaService, RedisService],
  exports: [PrismaService, RedisService],
})
export class AppConfigModule {}