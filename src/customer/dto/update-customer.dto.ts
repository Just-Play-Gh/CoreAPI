import { IsOptional, ValidateIf } from 'class-validator';

export class UpdateCustomerDto {
  @IsOptional()
  phoneNumber?: string;

  @IsOptional()
  password?: string;

  @ValidateIf((o) => o.phoneNumber)
  otp: string;

  @ValidateIf((o) => o.phoneNumber)
  country?: string;

  @IsOptional()
  email?: string;

  @IsOptional()
  phoneNumberVerifiedAt?: Date;
}
