import { BaseEntity } from 'typeorm';
export declare class AccessToken extends BaseEntity {
    id: number;
    userId: string;
    token: string;
    created: Date;
}
