import { IsNotEmpty } from 'class-validator';

export class CreateProductDto {
  @IsNotEmpty({ message: 'The product description is required' })
  description: string;

  @IsNotEmpty({ message: 'The price per litre field is required' })
  pricePerLitre: number;
}
