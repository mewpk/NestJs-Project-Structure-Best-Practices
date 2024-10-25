import { IsString, IsNotEmpty } from 'class-validator';

export class CreateDeviceDto {
  @IsString()
  @IsNotEmpty()
  deviceName: string;

  @IsString()
  @IsNotEmpty()
  deviceToken: string;
}
