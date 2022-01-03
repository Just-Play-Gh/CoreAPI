import { BaseEntity } from 'typeorm';
import { Order } from 'src/order/entities/order.entity';
export declare enum ProviderType {
    Default = "default",
    Google = "google",
    Apple = "apple"
}
export declare enum StatusType {
    Active = "1",
    Inactive = "0"
}
export declare class Customer extends BaseEntity {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    provider: ProviderType;
    providerId: string;
    phoneNumber: string;
    country: string;
    referralCode: string;
    password: string;
    status: StatusType;
    created: Date;
    updated: Date;
    emailVerifiedAt: Date;
    orders: Order[];
    hashPassword(): Promise<void>;
    generateReferralCode(): void;
    validatePassword(password: string): Promise<boolean>;
    getFullName(): Promise<string>;
    ratings_summary: Customer;
}
