import { IsNotEmpty } from 'class-validator';

export class UpdateDeviceDto {
  @IsNotEmpty({ message: 'Device id is required' })
  id: number;

  @IsNotEmpty({ message: 'alias is required' })
  alias: string;
}
