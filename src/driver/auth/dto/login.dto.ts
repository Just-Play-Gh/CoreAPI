import { IsNotEmpty } from 'class-validator';

export class LoginDto {
  @IsNotEmpty({ message: 'Please enter your phone number' })
  phoneNumber: string;

  @IsNotEmpty({ message: 'Please enter your country' })
  country: string;

  @IsNotEmpty({ message: 'Please enter your password' })
  password: string;
}
