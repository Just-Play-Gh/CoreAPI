import { IsNotEmpty } from 'class-validator';

export class CreatePushNotificationTokenDto {
  @IsNotEmpty({ message: 'Enter push notification token' })
  token: string;

  @IsNotEmpty({ message: 'Enter device name' })
  device_name: string;
}
