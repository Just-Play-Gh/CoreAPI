import { BaseEntity } from 'typeorm';
import { Order } from 'src/order/entities/order.entity';
export declare enum StatusType {
    Active = "1",
    Inactive = "0"
}
export declare class Driver extends BaseEntity {
    id: number;
    ratings_summary: Driver;
    status: StatusType;
    firstName: string;
    lastName: string;
    phoneNumber: string;
    password: string;
    email: string;
    dateOfBirth: Date;
    address: string;
    licenseNumber: string;
    created: Date;
    updated: Date;
    deleted: Date;
    orders: Order[];
    validatePassword(password: string): Promise<boolean>;
    hashPassword(): Promise<void>;
    generateToken(): Promise<void>;
}
