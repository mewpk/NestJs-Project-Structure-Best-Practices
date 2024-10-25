import { Controller, Post, Body, Get, Req, UseGuards } from '@nestjs/common';
import { DeviceService } from './device.service';
import { CreateDeviceDto } from './dto/create-device.dto';
import { DeviceGuard } from '@guards/device.guard';
import { successResponse, errorResponse } from '@utils/response.util';

@Controller('devices')
export class DeviceController {
  constructor(private readonly deviceService: DeviceService) {}

  @Post('register')
  async registerDevice(@Body() createDeviceDto: CreateDeviceDto) {
    try {
      const device = await this.deviceService.createDevice(createDeviceDto);
      return successResponse(device, 'Device registered successfully');
    } catch (error) {
      return errorResponse('Failed to register device', error.message);
    }
  }

  @Get('all')
  async getAllDevices() {
    return this.deviceService.getDevices();
  }

  @UseGuards(DeviceGuard)
  @Get('protected')
  async getProtectedData() {
    return successResponse({ data: 'This is protected data' }, 'Success');
  }
}
