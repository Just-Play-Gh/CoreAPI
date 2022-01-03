import { HttpService } from '@nestjs/axios';
import { IPaginationOptions, Pagination } from 'nestjs-typeorm-paginate';
import { BaseService } from 'src/resources/base.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { OrderLog } from './entities/order-logs.entity';
import { Order } from './entities/order.entity';
import { EventEmitter2 } from '@nestjs/event-emitter';
export declare class OrderService extends BaseService {
    private readonly httpService;
    private eventEmitter;
    constructor(httpService: HttpService, eventEmitter: EventEmitter2);
    store(createOrderDto: CreateOrderDto, customer: any): Promise<Order>;
    getOrders(options: IPaginationOptions, filter?: {}): Promise<Pagination<Order>>;
    acceptOrder(driver: any, orderId: string): Promise<Order>;
    assignDriverToOrder(id: string, updateOrderDto: UpdateOrderDto): Promise<Order>;
    cancelOrder(orderId: any, customer: any): Promise<Order>;
    getOrderLogs(orderId: any): Promise<OrderLog[]>;
}
