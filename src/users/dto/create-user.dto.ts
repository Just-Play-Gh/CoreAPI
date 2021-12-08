import { IsEmail, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty({ message: 'Please enter a phone number' })
  phoneNumber: string;

  @IsNotEmpty({ message: 'Please enter an email' })
  @IsEmail({ message: 'Please enter a valid email address' })
  email: string;

  @IsNotEmpty({ message: 'Please enter a first name' })
  firstName: string;

  @IsNotEmpty({ message: 'Please enter a last name' })
  lastName: string;
}
