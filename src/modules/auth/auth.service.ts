import { Injectable } from '@nestjs/common';
import { PrismaService } from '@prisma/prisma.service';
import { RedisService } from '@config/redis.config';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly redisService: RedisService,
  ) {}

  async createUser(createUserDto: CreateUserDto) {
    const user = await this.prisma.db1.user.create({
      data: createUserDto,
    });

    // Cache the new user
    await this.redisService.getClient().set(`user:${user.id}`, JSON.stringify(user), 'EX', 3600);

    return user;
  }

  async getUserById(userId: string) {
    // Check cache first
    const cachedUser = await this.redisService.getClient().get(`user:${userId}`);
    if (cachedUser) {
      return JSON.parse(cachedUser);
    }

    // If not cached, fetch from database
    const user = await this.prisma.db1.user.findUnique({
      where: { id: userId },
    });

    // Cache the result
    if (user) {
      await this.redisService.getClient().set(`user:${user.id}`, JSON.stringify(user), 'EX', 3600);
    }

    return user;
  }
}