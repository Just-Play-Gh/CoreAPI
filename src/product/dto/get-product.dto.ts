import { IsNotEmpty } from 'class-validator';

export class GetProductDto {
  @IsNotEmpty({ message: 'Product ID is required' })
  id: number;
}
