import { BaseEntity } from 'typeorm';
import { StatusType } from 'src/customer/entities/customer.entity';
export declare class User extends BaseEntity {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    status: StatusType;
    created: Date;
    updated: Date;
    deleted: Date;
    emailVerifiedAt: Date;
}
