import { BaseEntity } from 'typeorm';
export declare class RefreshToken extends BaseEntity {
    id: number;
    userId: string;
    token: string;
    created: Date;
}
