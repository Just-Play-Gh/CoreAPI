import { IsNotEmpty } from 'class-validator';

export class GetDriverByPhoneNumberDto {
  @IsNotEmpty({ message: 'Please enter your phone number' })
  phoneNumber: string;

  @IsNotEmpty({ message: 'Please enter your country' })
  country: string;
}
