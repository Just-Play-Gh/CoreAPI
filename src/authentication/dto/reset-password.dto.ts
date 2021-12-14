import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';
import { Match } from '../../helpers/password.decorator';

export class ResetPasswordOtpDto {
  @IsNotEmpty({ message: 'Phone number is required' })
  phoneNumber: string;

  @IsNotEmpty({ message: 'Password is required' })
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  password: string;

  @IsNotEmpty({ message: 'Password confirmation is required' })
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  @Match('password', { message: 'Passwords do not match' })
  passwordConfirmation: string;

  @IsNotEmpty({ message: 'OTP is required' })
  otp: string;

  @IsNotEmpty({ message: 'Please enter your country' })
  country: string;
}

export class ResetPasswordEmailDto {
  @IsNotEmpty({ message: 'Please enter your email' })
  @IsEmail({}, { message: 'Please enter a valid email' })
  email: string;

  @IsNotEmpty({ message: 'Password is required' })
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  password: string;

  @IsNotEmpty({ message: 'Password confirmation is required' })
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  @Match('password', { message: 'Passwords do not match' })
  passwordConfirmation: string;

  @IsNotEmpty({ message: 'OTP is required' })
  otp: string;
}
