import { IsNotEmpty } from 'class-validator';

export class SendOtpDto {
  @IsNotEmpty({ message: 'Please enter your phone number' })
  phoneNumber: string;
}
