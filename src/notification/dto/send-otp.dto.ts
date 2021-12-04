import { IsNotEmpty, IsOptional } from 'class-validator';

export class SendOtpDto {
  @IsNotEmpty({ message: 'Please enter your phone number' })
  phoneNumber: string;

  @IsOptional()
  email?: string;

  @IsNotEmpty({ message: 'Please enter your country' })
  country: string;
}
