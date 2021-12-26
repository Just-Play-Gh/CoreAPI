import { Customer } from '../../../customer/entities/customer.entity';
import { BaseEntity } from 'typeorm';
export declare class CustomerRatingsSummary extends BaseEntity {
    id: number;
    customer: Customer;
    totalStars: number;
    totalCount: number;
    date: Date;
}
