import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from '@guards/jwt.strategy'; 
import { PrismaService } from '@prisma/prisma.service';
import { RedisService } from 'src/configs/redis.config';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '1h' },
    }),

  ],
  providers: [AuthService, JwtStrategy, PrismaService, RedisService],
  controllers: [AuthController],
})
export class AuthModule { }
