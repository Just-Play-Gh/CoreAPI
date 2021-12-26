import { BaseEntity } from 'typeorm';
declare enum UserType {
    Customer = "customer",
    Rider = "rider"
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
export {};
