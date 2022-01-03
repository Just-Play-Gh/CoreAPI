import { Tax } from '../../tax/entities/tax.entity';
import { BaseEntity } from 'typeorm';
declare enum ProductStatusType {
    Active = "active",
    Inactive = "inactive"
}
export declare class Product extends BaseEntity {
    id: number;
    name: string;
    description: string;
    pricePerLitre: number;
    status: ProductStatusType;
    created: Date;
    updated: Date;
    taxes: Tax[];
}
export {};
