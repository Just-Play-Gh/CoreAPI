import { IsEmail, IsNotEmpty, IsOptional } from 'class-validator';

export class RegisterDto {
  @IsNotEmpty({ message: 'Please enter your first name' })
  firstName: string;

  @IsNotEmpty({ message: 'Please enter your last name' })
  lastName: string;

  @IsOptional()
  provider: string;

  @IsOptional()
  emailVerifiedAt: Date;

  @IsNotEmpty({ message: 'Please enter your phone number' })
  phoneNumber: string;

  @IsNotEmpty({ message: 'Please enter your country' })
  country: string;

  @IsOptional()
  @IsEmail()
  email: string;

  @IsNotEmpty({ message: 'Please enter your password' })
  password: string;
}
