import { IsEmail, IsNotEmpty, IsOptional } from 'class-validator';

export class RegisterDriverDto {
  @IsNotEmpty({ message: 'Please enter your first name' })
  firstName: string;

  @IsNotEmpty({ message: 'Please enter your last name' })
  lastName: string;

  @IsNotEmpty({ message: 'Please enter your phone number' })
  phoneNumber: string;

  @IsNotEmpty({ message: 'Please enter your email' })
  @IsEmail({}, { message: 'Please enter a valid email' })
  email: string;

  @IsNotEmpty({ message: "Please driver's date of birth" })
  dateOfBirth: string;

  @IsNotEmpty({ message: "Please driver's address" })
  address: string;

  @IsNotEmpty({ message: "Please driver's license number" })
  licenseNumber: string;
}
