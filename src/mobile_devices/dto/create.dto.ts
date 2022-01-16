import { IsNotEmpty } from 'class-validator';
import { UserType } from '../entities/mobile-device.entity';

export class CreateMobileDeviceDto {
  @IsNotEmpty({ message: 'Enter push notification token' })
  push_notification_token: string;

  @IsNotEmpty({ message: 'Enter device name' })
  device_name: string;

  @IsNotEmpty({ message: 'Enter user type' })
  user_type: UserType;
}
