import { IsEmail, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty({ message: 'Please enter an email' })
  @IsEmail({ message: 'Please enter a valid email address' })
  email: string;

  @IsOptional({ message: 'Please enter a phone number' })
  phoneNumber: string;

  @IsOptional({ message: 'Please enter a first name' })
  firstName: string;

  @IsOptional({ message: 'Please enter a last name' })
  lastName: string;

  @IsOptional({ message: 'You need to select a role' })
  roleId: string;
}
