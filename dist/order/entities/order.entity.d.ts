import { BaseEntity } from 'typeorm';
export declare enum OrderStatusType {
    Pending = "pending",
    Completed = "completed",
    Cancelled = "cancelled"
}
export declare class Order extends BaseEntity {
    id: number;
    invoiceId: string;
    customerId: string;
    driverId: string;
    latlong: number;
    customerLocation: string;
    status: OrderStatusType;
    created: Date;
    updated: Date;
    isPending(): Promise<boolean>;
    hasBeenAssigned(): Promise<boolean>;
}
