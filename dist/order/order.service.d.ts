import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { Order } from './entities/order.entity';
export declare class OrderService {
    getAll(): Promise<Order[]>;
    create(createOrderDto: CreateOrderDto): Promise<Order>;
    update(id: string, updateOrderDto: UpdateOrderDto): Promise<Order>;
    acceptOrder(driverId: string, orderId: string): Promise<Order>;
    assignDriverToOrder(id: string, updateOrderDto: UpdateOrderDto): Promise<Order>;
}
