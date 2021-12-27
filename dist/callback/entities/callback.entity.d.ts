import { BaseEntity } from 'typeorm';
export declare class Tax extends BaseEntity {
    id: number;
    invoiceNumber: string;
    callback: JSON;
    created: Date;
    updated: Date;
}
