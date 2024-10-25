import { Injectable } from '@nestjs/common';
import { PrismaService } from '@prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class AuthService {
  constructor(private readonly prisma: PrismaService) {}

  async createUser(createUserDto: CreateUserDto) {
    const user = await this.prisma.db1.user.create({
      data: createUserDto,
    });

    return user;
  }

  async getUserById(userId: string) {
    const user = await this.prisma.db1.user.findUnique({
      where: { id: userId },
    });

    return user;
  }
}
