import { IsIn, IsNotEmpty, IsOptional } from 'class-validator';
import { DeviceType } from '../entities/device.entity';

export class CreateDeviceDto {
  @IsNotEmpty({ message: 'The name field is required' })
  name: string;

  @IsOptional()
  model: string;

  @IsIn(['heavy_duty', 'vehicle', 'generator'])
  type: DeviceType;
}
