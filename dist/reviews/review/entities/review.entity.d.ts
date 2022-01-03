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
    customerReview: string;
    driverReview: string;
    stars: number;
    createdDate: string;
    created: Date;
    updated: Date;
    getDate(): void;
}
