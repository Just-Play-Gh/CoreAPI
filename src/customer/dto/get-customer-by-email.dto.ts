import { IsEmail, IsNotEmpty } from 'class-validator';

export class GetCustomerByEmailDto {
  @IsNotEmpty({ message: 'Email should not be empty' })
  @IsEmail()
  email: string;

  @IsNotEmpty({ message: 'Provider ID is required' })
  providerId: string;

  @IsNotEmpty({ message: 'Provider is required' })
  provider: string;
}
