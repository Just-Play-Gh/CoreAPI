import { IsEmail, IsNotEmpty, IsNumberString } from 'class-validator';

export class ForgotPasswordWithOtp {
  @IsNotEmpty({ message: 'Please enter your phone number' })
  @IsNumberString({}, { message: 'Please enter a valid phone number' })
  phoneNumber: string;

  @IsNotEmpty({ message: 'Please enter your country' })
  country: string;

  @IsNotEmpty({ message: 'User type required' })
  userType: string;
}

export class ForgotPasswordWithEmail {
  @IsNotEmpty({ message: 'Please enter your email' })
  @IsEmail({}, { message: 'Please enter a valid email' })
  email: string;

  @IsNotEmpty({ message: 'User type required' })
  userType: string;
}
