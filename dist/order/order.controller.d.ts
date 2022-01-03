import { BaseController } from 'src/resources/base.controller';
import { GetOrderDto } from './dto/get-order.dto';
import { OrderLog } from './entities/order-logs.entity';
import { Order } from './entities/order.entity';
import { OrderService } from './order.service';
export declare class OrderController extends BaseController {
    private readonly orderService;
    constructor(orderService: OrderService);
    store(customer: any, body: any): Promise<Order>;
    getOrdersForCustomer(customer: any, page: number, limit: number, getOrders: GetOrderDto): Promise<import("nestjs-typeorm-paginate").Pagination<Order, import("nestjs-typeorm-paginate").IPaginationMeta>>;
    getOrdersForDriver(driver: any, page: number, limit: number, getOrders: GetOrderDto): Promise<import("nestjs-typeorm-paginate").Pagination<Order, import("nestjs-typeorm-paginate").IPaginationMeta>>;
    acceptOrder(driver: any, id: string): Promise<Order>;
    cancelOrder(customer: any, id: string): Promise<Order>;
    getOrderLogs(orderId: number): Promise<OrderLog[]>;
}
