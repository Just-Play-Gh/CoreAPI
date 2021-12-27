import { BaseEntity } from 'typeorm';
export declare class Permission extends BaseEntity {
    id: number;
    name: string;
    created: Date;
    updated: Date;
}
