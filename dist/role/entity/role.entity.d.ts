import { Permission } from '../../permission/entity/permission.entity';
import { BaseEntity } from 'typeorm';
export declare class Role extends BaseEntity {
    id: number;
    name: string;
    alias: string;
    created: Date;
    updated: Date;
    permissions: Permission[];
}
