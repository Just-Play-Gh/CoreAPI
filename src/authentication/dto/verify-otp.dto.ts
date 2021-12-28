import { IsNotEmpty, IsNumberString } from 'class-validator';

export class VerifyOtpDto {
  @IsNotEmpty({ message: 'Please enter your phone number' })
  @IsNumberString({}, { message: 'Please enter a valid phone number' })
  phoneNumber: string;

  @IsNotEmpty({ message: 'Please enter your country' })
  country: string;

  @IsNotEmpty({ message: 'User type required' })
  userType: string;

  @IsNotEmpty({ message: 'OTP required' })
  otp: string;

  deleteOtp?: boolean;
}
