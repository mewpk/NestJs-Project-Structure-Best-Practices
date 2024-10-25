import { Injectable } from '@nestjs/common';
import { PrismaService } from '@prisma/prisma.service';
import { CreateDeviceDto } from './dto/create-device.dto';

@Injectable()
export class DeviceService {
  constructor(private readonly prisma: PrismaService) {}

  async createDevice(createDeviceDto: CreateDeviceDto) {
    const { deviceName, deviceToken } = createDeviceDto;

    const existingDevice = await this.prisma.db2.device.findUnique({
      where: { deviceToken },
    });

    if (existingDevice) {
      throw new Error('Device with this token already exists.');
    }
    return this.prisma.db2.device.create({
      data: {
        deviceName,
        deviceToken,
      },
    });
  }

  async getDevices() {
    return this.prisma.db2.device.findMany();
  }

  async verifyDevice(deviceToken: string) {
    return this.prisma.db2.device.findUnique({
      where: { deviceToken },
    });
  }
}
