import { BaseEntity } from 'typeorm';
export declare class OrderLog extends BaseEntity {
    id: number;
    invoiceId: string;
    message: string;
    created: Date;
}
