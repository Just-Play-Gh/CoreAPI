import { IsNotEmpty } from 'class-validator';
import { InvoiceStatusType } from '../entities/invoice.entity';

export class UpdateInvoiceDto {
  @IsNotEmpty({ message: 'Invoice is required' })
  invoiceId: number;

  @IsNotEmpty({ message: 'Channel is required' })
  channel: string;

  @IsNotEmpty({ message: 'Channel Transaction ID is required' })
  channelTransactionId: string;

  @IsNotEmpty({ message: 'Status is required' })
  status: InvoiceStatusType;
}
