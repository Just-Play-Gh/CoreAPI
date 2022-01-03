import { InvoiceStatusType } from '../entities/invoice.entity';
export declare class UpdateInvoiceDto {
    invoiceId: number;
    channel: string;
    channelTransactionId: string;
    status: InvoiceStatusType;
}
