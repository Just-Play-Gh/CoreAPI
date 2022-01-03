import { Customer } from 'src/customer/entities/customer.entity';
import { Driver } from 'src/driver/entities/driver.entity';
import { Tax } from 'src/tax/entities/tax.entity';
import { BaseEntity } from 'typeorm';
import { OrderLog } from './order-logs.entity';
export declare enum OrderStatusType {
    Pending = "pending",
    Completed = "completed",
    Cancelled = "cancelled"
}
export declare class Order extends BaseEntity {
    id: number;
    orderId: string;
    pricePerLitre: number;
    amount: number;
    totalAmount: number;
    taxes: Tax[];
    customerFullName: string;
    channel: string;
    channelTransactionId: string;
    customerId: string;
    driverId: string;
    latlong: string;
    status: OrderStatusType;
    created: Date;
    updated: Date;
    driver: Driver;
    customer: Customer;
    cancel(): Promise<this>;
    isPending(): Promise<boolean>;
    hasBeenAssigned(): Promise<boolean>;
    createLog(message: any): Promise<OrderLog>;
}
