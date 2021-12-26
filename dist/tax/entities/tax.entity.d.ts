import { StatusType } from '../../types/index';
import { BaseEntity } from 'typeorm';
export declare enum TaxType {
    Fixed = "fixed",
    Percentage = "percentage"
}
export declare class Tax extends BaseEntity {
    id: number;
    type: TaxType;
    description: string;
    value: number;
    status: StatusType;
    created: Date;
    updated: Date;
}
