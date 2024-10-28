import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';

@Injectable()
export class RedisService {
  private readonly redisClient: Redis;

  constructor(private configService: ConfigService) {
    this.redisClient = new Redis({
      host: this.configService.get<string>('REDIS_HOST') ,
      port: Number(this.configService.get<string>('REDIS_PORT')) ,
      password: this.configService.get<string>('REDIS_PASSWORD') ,
    });
  }

  getClient(): Redis {
    return this.redisClient;
  }
}