import { Injectable, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '@prisma/prisma.service';
import { RedisService } from 'src/configs/redis.config';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly redisService: RedisService,
  ) {}

  // Register a new user
  async createUser(createUserDto: CreateUserDto) {
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

    try {
      const user = await this.prisma.db1.user.create({
        data: {
          email: createUserDto.email,
          name: createUserDto.name,
          password: hashedPassword,
        },
      });

      return user;
    } catch (error) {
      if (error.code === 'P2002' && error.meta?.target.includes('email')) {
        throw new BadRequestException('Email already exists');
      }
      throw error;
    }
  }

  // Validate user credentials
  async validateUser(email: string, password: string) {
    const user = await this.prisma.db1.user.findUnique({ where: { email } });
    if (user && await bcrypt.compare(password, user.password)) {
      return user;
    }
    return null;
  }


  async login(loginUserDto: LoginUserDto) {
    const user = await this.validateUser(loginUserDto.email, loginUserDto.password);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { sub: user.id, email: user.email };
    const token = this.jwtService.sign(payload);

    // Store the token in Redis with a 1-hour expiration
    await this.redisService.getClient().set(`session:${user.id}`, token, 'EX', 3600);

    return { accessToken: token };
  }


  async logout(userId: string) {
    await this.redisService.getClient().del(`session:${userId}`);
    return { message: 'Logged out successfully' };
  }

  async getProfile(userId: string) {
    return this.prisma.db1.user.findUnique({ where: { id: userId } });
  }
}
