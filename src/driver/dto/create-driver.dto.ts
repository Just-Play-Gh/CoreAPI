import { IsDateString, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateDriverDto {
  @IsNotEmpty({
    message: "Please enter driver's phone number",
    context: 'phoneNumber',
  })
  phoneNumber: string;

  @IsNotEmpty({ message: "Please enter driver's first name" })
  firstName: string;

  @IsNotEmpty({ message: "Please enter driver's last name" })
  lastName: string;

  @IsOptional({ message: "Please enter driver's date of birth" })
  dateOfBirth: string;

  @IsOptional()
  profileImage: string;

  @IsNotEmpty({ message: "Please enter driver's address" })
  address: string;

  @IsNotEmpty({ message: "Please enter driver's license number" })
  licenseNumber: string;
}
