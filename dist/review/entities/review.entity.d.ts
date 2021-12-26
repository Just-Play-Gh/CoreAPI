import { BaseEntity } from 'typeorm';
export declare enum ReviewType {
    Customer = "customer",
    Driver = "driver"
}
export declare class Review extends BaseEntity {
    id: number;
    customerId: string;
    driverId: string;
    invoiceId: string;
    review: string;
    reviewType: ReviewType;
    created: Date;
}
