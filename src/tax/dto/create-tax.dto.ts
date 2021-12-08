import { IsNotEmpty } from 'class-validator';

export class CreateTaxDto {
  @IsNotEmpty({ message: 'Please enter tax value' })
  value: string;
}
