import { IsEmail, IsNotEmpty, IsOptional } from 'class-validator';

export class RegisterCustomerDto {
  @IsNotEmpty({ message: 'Please enter your first name' })
  firstName: string;

  @IsNotEmpty({ message: 'Please enter your last name' })
  lastName: string;

  @IsNotEmpty({ message: 'Please enter your phone number' })
  phoneNumber: string;

  @IsNotEmpty({ message: 'Please enter your email' })
  @IsEmail({}, { message: 'Please enter a valid email' })
  email: string;

  @IsOptional()
  provider?: string;
}
