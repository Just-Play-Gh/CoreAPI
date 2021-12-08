import { IsEmail, IsNotEmpty, IsNumberString } from 'class-validator';

export class SendForgotPasswordOtp {
  @IsNotEmpty({ message: 'Please enter your phone number' })
  @IsNumberString({}, { message: 'Please enter a valid phone number' })
  phoneNumber: string;

  @IsNotEmpty({ message: 'Please enter your country' })
  country: string;
}

export class SendForgotPasswordEmail {
  @IsNotEmpty({ message: 'Please enter your email' })
  @IsEmail({}, { message: 'Please enter a valid email' })
  email: string;
}
