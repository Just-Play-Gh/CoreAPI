import { Injectable } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { Order, OrderStatusType } from './entities/order.entity';

@Injectable()
export class OrderService {
  async create(createOrderDto: CreateOrderDto): Promise<Order> {
    try {
      const order = Order.create();
      for (const key in createOrderDto) {
        order[key] = createOrderDto[key];
      }
      order.status = OrderStatusType.Pending;
      return Order.save(order);
    } catch (error) {
      throw error;
    }
  }
}
