import { StatusType } from './customer/entities/customer.entity';
import { InvoiceStatusType } from './invoice/entities/invoice.entity';
import { Tax, TaxType } from './tax/entities/tax.entity';
export declare const registerData: {
    firstName: string;
    lastName: string;
    phoneNumber: string;
    email: string;
    password: string;
};
export declare const userDetails: {
    firstName: string;
    lastName: string;
    phoneNumber: string;
    email: string;
    password: string;
    id: number;
    created: Date;
    updated: Date;
};
export declare const tax: {
    id: number;
    value: number;
    type: TaxType;
    created: Date;
    updated: Date;
    description: string;
    status: StatusType;
};
export declare const product: {
    id: number;
    name: string;
    pricePerLitre: number;
    created: Date;
    updated: Date;
    description: string;
    status: boolean;
    taxes: {
        id: number;
        value: number;
        type: TaxType;
        created: Date;
        updated: Date;
        description: string;
        status: StatusType;
    }[];
};
export declare const invoice: {
    id: number;
    pricePerLitre: number;
    invoiceNumber: string;
    totalAmount: number;
    customerFullName: string;
    channel: string;
    channelTransactionId: string;
    customerPhoneNumber: string;
    taxes: Tax[];
    status: InvoiceStatusType;
    created: Date;
    updated: Date;
};
