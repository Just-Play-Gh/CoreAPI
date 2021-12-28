import { IsEmail, IsNotEmpty, IsNumberString } from 'class-validator';

export class LoginDto {
  @IsNotEmpty({ message: 'Please enter your phone number' })
  @IsNumberString({}, { message: 'Please enter a valid phone number' })
  phoneNumber: string;

  @IsNotEmpty({ message: 'Please enter your country' })
  country: string;

  @IsNotEmpty({ message: 'Please enter your password' })
  password: string;
}

export class oauthLoginDto {
  @IsNotEmpty({ message: 'Email required' })
  @IsEmail({}, { message: 'Enter a valid email required' })
  email: string;

  @IsNotEmpty({ message: 'User type required' })
  userType: string;
}
