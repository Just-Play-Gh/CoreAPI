import { IsNotEmpty } from 'class-validator';

export class UpdateMobileDeviceDto {
  @IsNotEmpty({ message: 'Enter User Id' })
  user_id: number;
}
