import { IsNotEmpty, IsOptional } from 'class-validator';

export class AddDeviceToGroupDto {
  @IsNotEmpty({ message: 'The devices field is required' })
  devices: number[];
}
