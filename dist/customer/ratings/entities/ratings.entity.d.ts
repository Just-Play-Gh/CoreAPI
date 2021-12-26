import { Customer } from '../../../customer/entities/customer.entity';
import { BaseEntity } from 'typeorm';
export declare class CustomerRatings extends BaseEntity {
    id: number;
    customer: Customer;
    star: number;
    created: Date;
}
