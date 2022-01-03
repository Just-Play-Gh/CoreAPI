import { Tax } from '../../tax/entities/tax.entity';
import { BaseEntity } from 'typeorm';
export declare enum InvoiceStatusType {
    Pending = "pending",
    Processing = "processing",
    Failed = "failed",
    Paid = "paid"
}
export declare class Invoice extends BaseEntity {
    id: number;
    invoiceNumber: string;
    pricePerLitre: number;
    totalAmount: number;
    taxes: Tax[];
    status: InvoiceStatusType;
    customerFullName: string;
    channel: string;
    channelTransactionId: string;
    customerPhoneNumber: string;
    created: Date;
    updated: Date;
}
