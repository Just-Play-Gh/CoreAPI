import { IsNotEmpty } from 'class-validator';

export class CreateInvoiceDto {
  @IsNotEmpty({ message: 'Product ID is required' })
  productId: number;

  @IsNotEmpty({ message: 'Amount is required' })
  amount: number;
}
