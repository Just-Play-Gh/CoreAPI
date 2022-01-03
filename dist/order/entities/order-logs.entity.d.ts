import { BaseEntity } from 'typeorm';
export declare enum OrderLogEventMessages {
    Created = "Looking for the closest driver.",
    Accepted = "A driver has accepted the request and is on their way to you.",
    Assigned = "A driver has been assigned to your order.",
    Cancelled = "Order has been cancelled."
}
export declare class OrderLog extends BaseEntity {
    id: number;
    orderId: number;
    message: string;
    created: Date;
}
