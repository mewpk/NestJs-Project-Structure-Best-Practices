import { Injectable } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class RedisService {
  private readonly redisClient: Redis;

  constructor() {
    this.redisClient = new Redis({
      host: process.env.REDIS_HOST ,
      port: Number(process.env.REDIS_PORT) ,
      password: process.env.REDIS_PASSWORD ,
    });
  }

  getClient(): Redis {
    return this.redisClient;
  }
}