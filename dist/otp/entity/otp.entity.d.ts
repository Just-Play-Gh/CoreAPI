import { BaseEntity } from 'typeorm';
export declare enum UserType {
    Customer = "customer",
    Driver = "driver"
}
export declare class Otp extends BaseEntity {
    id: number;
    userType: UserType;
    phoneNumber: string;
    token: string;
    created: Date;
    hashToken(): Promise<void>;
    validateToken(otp: string): Promise<boolean>;
}
