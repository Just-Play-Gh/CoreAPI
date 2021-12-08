import { IsNotEmpty, IsNumberString } from 'class-validator';

export class LoginDto {
  @IsNotEmpty({ message: 'Please enter your phone number' })
  @IsNumberString({}, { message: 'Please enter a valid phone number' })
  phoneNumber: string;

  @IsNotEmpty({ message: 'Please enter your country' })
  country: string;

  @IsNotEmpty({ message: 'Please enter your password' })
  password: string;
}
