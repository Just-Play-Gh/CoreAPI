import { IsNotEmpty } from 'class-validator';

export class AddDeviceToGroupDto {
  @IsNotEmpty({ message: 'The devices field is required' })
  devices: string[];
}
