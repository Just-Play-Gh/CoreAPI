import { BaseEntity } from 'typeorm';
declare enum UserStatusType {
    Active = "active",
    Inactive = "inactive"
}
export declare class User extends BaseEntity {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    password: string;
    status: UserStatusType;
    created: Date;
    updated: Date;
    deleted: Date;
    emailVerifiedAt: Date;
    hashPassword(): Promise<void>;
    validatePassword(password: string): Promise<boolean>;
    generatePassword(length: number): Promise<string>;
}
export {};
