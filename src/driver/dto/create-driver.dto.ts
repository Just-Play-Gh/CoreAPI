import { IsDateString, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateDriverDto {
  @IsNotEmpty({ message: 'Phone number is required' })
  phoneNumber: string;

  @IsNotEmpty({ message: 'First name is required' })
  firstName: string;

  @IsNotEmpty({ message: 'Last name is required' })
  lastName: string;

  @IsNotEmpty({ message: 'Date of birth is required' })
  @IsDateString({}, { message: 'Date of birth must be a valid date' })
  dateOfBirth: string;

  @IsOptional()
  profileImage: string;

  @IsNotEmpty({ message: 'Address is required' })
  address: string;

  @IsNotEmpty({ message: 'License number is required' })
  licenseNumber: string;
}
