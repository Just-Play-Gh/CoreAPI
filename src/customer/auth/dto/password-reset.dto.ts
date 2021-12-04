import { IsNotEmpty } from 'class-validator';

export class ResetPasswordDto {
  @IsNotEmpty({ message: 'Phone number is required' })
  phoneNumber: string;

  @IsNotEmpty({ message: 'Password is required' })
  password: string;

  @IsNotEmpty({ message: 'Password confirmation is required' })
  passwordConfirmation: string;

  @IsNotEmpty({ message: 'OTP is required' })
  otp: string;

  @IsNotEmpty({ message: 'Please enter your country' })
  country: string;
}
