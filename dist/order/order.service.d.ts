import { BaseService } from 'src/resources/base.service';
import { UpdateOrderDto } from './dto/update-order.dto';
import { Order } from './entities/order.entity';
export declare class OrderService extends BaseService {
    constructor();
    acceptOrder(driverId: string, orderId: string): Promise<Order>;
    assignDriverToOrder(id: string, updateOrderDto: UpdateOrderDto): Promise<Order>;
}
