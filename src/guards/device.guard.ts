import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { DeviceService } from '@modules/device/device.service';

@Injectable()
export class DeviceGuard implements CanActivate {
  constructor(private readonly deviceService: DeviceService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const deviceToken = request.headers['device-token'];

    if (!deviceToken) {
      throw new UnauthorizedException('Device token is missing');
    }

    // Check if the device token exists in the database
    const device = await this.deviceService.verifyDevice(deviceToken);
    if (!device) {
      throw new UnauthorizedException('Invalid device token');
    }

    // Device is authenticated, allow access
    return true;
  }
}
