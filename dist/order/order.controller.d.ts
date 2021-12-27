import { BaseController } from 'src/resources/base.controller';
import { Order } from './entities/order.entity';
import { OrderService } from './order.service';
export declare class OrderController extends BaseController {
    private readonly orderService;
    constructor(orderService: OrderService);
    acceptOrder(driver: any, id: string): Promise<Order>;
}
