import { IsEmail, IsNotEmpty } from 'class-validator';

export class CreateDriverDto {
  @IsNotEmpty({ message: 'Phone number is required' })
  phoneNumber: string;
  @IsNotEmpty({ message: 'First name is required' })
  firstName: string;
  @IsNotEmpty({ message: 'Last name is required' })
  lastName: string;
  @IsNotEmpty({ message: 'Last name is required' })
  dateOfBirth: string;
  @IsNotEmpty({ message: 'Profile image is required' })
  profile_image: string;
}
