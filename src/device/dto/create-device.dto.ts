import { IsNotEmpty } from 'class-validator';
import { DeviceType } from '../entities/device.entity';

export class CreateDeviceDto {
  @IsNotEmpty({ message: 'name id is required' })
  name: string;

  @IsNotEmpty({ message: 'model is required' })
  model: string;

  @IsNotEmpty({ message: 'model  is required' })
  alias: string;

  @IsNotEmpty({ message: 'device type is required' })
  type: DeviceType;
}
