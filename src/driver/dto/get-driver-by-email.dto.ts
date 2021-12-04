import { IsEmail, IsNotEmpty, IsOptional } from 'class-validator';

export class GetCustomerByEmailDto {
  @IsNotEmpty({ message: 'Email should not be empty' })
  @IsEmail()
  email: string;

  @IsOptional()
  providerId?: string;

  @IsOptional()
  provider?: string;
}
