import { IsNotEmpty, IsOptional } from 'class-validator';

export class AddDeviceToGroupDto {
  @IsNotEmpty({ message: 'The name field is required' })
  deviceId: number;

  @IsOptional()
  groupId: number;
}
