import { BaseEntity } from 'typeorm';
export declare enum ReviewType {
    Customer = "customer",
    Driver = "driver"
}
export declare class ReviewSummary extends BaseEntity {
    id: number;
    customerId: string;
    driverId: string;
    invoiceId: string;
    totalCount: number;
    rating: number;
    totalStars: number;
    created: Date;
    updated: Date;
}
