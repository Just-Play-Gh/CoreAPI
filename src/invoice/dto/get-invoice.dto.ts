import { IsNotEmpty } from 'class-validator';

export class GetInvoiceDto {
  @IsNotEmpty({ message: 'Invoice ID is required' })
  invoiceId: number;
}
