import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { Order } from './entities/order.entity';
import { OrderService } from './order.service';
export declare class OrderController {
    private readonly orderService;
    constructor(orderService: OrderService);
    createOrder(createOrderDto: CreateOrderDto): Promise<Order>;
    updateOrder(id: string, updateOrderDto: UpdateOrderDto): Promise<Order>;
    acceptOrder(driver: any, id: string): Promise<Order>;
}
