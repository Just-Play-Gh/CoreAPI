import { BaseEntity } from 'typeorm';
export declare enum DeviceType {
    Vehicle = "vehicle",
    Generator = "generator",
    HeavyDuty = "heavy_duty"
}
export declare class Device extends BaseEntity {
    id: number;
    name: string;
    model: string;
    customerId: number;
    alias: string;
    type: DeviceType;
    created: Date;
    updated: Date;
    deleted: Date;
}
