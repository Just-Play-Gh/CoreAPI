import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { Order, OrderStatusType } from './entities/order.entity';

@Injectable()
export class OrderService {
  async getAll(): Promise<Order[]> {
    return [];
  }

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

  async update(id: string, updateOrderDto: UpdateOrderDto): Promise<Order> {
    const { driverId, customerLocation } = updateOrderDto;
    const order = await Order.findOne(id);
    if (!order)
      throw new HttpException('Order Not Found', HttpStatus.NOT_FOUND);
    order.driverId = driverId;
    order.customerLocation = customerLocation;
    return await Order.save(order);
  }
}
