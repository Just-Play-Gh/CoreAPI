import { BaseEntity } from 'typeorm';
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
    password: string;
    status: StatusType;
    created: Date;
    updated: Date;
    emailVerifiedAt: Date;
    hashPassword(): Promise<void>;
    validatePassword(password: string): Promise<boolean>;
}
