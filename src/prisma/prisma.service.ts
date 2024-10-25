import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient as PrismaClientDb1 } from '@generated/client_master';
import { PrismaClient as PrismaClientDb2 } from '@generated/client_slave';

@Injectable()
export class PrismaService implements OnModuleInit, OnModuleDestroy {
  private prismaDb1: PrismaClientDb1;
  private prismaDb2: PrismaClientDb2;

  constructor() {
    this.prismaDb1 = new PrismaClientDb1();
    this.prismaDb2 = new PrismaClientDb2();
  }

  async onModuleInit() {
    await this.prismaDb1.$connect();
    await this.prismaDb2.$connect();
  }

  async onModuleDestroy() {
    await this.prismaDb1.$disconnect();
    await this.prismaDb2.$disconnect();
  }

  get db1() {
    return this.prismaDb1;
  }

  get db2() {
    return this.prismaDb2;
  }
}
