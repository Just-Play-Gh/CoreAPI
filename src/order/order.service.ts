import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { BaseService } from 'src/resources/base.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { Order, OrderStatusType } from './entities/order.entity';

@Injectable()
export class OrderService extends BaseService {
  constructor() {
    super(Order);
  }

  async getMyOrders(customerId: string): Promise<Order[]> {
    return await Order.getRepository()
      .createQueryBuilder()
      .where({ customerId })
      .orderBy({ status: 'DESC' })
      .getMany();
  }

  async acceptOrder(driverId: string, orderId: string): Promise<Order> {
    const order = await Order.findOne(orderId);
    if (!order)
      throw new HttpException('Order Not Found', HttpStatus.NOT_FOUND);

    if (!((await order.isPending()) || order.hasBeenAssigned())) {
      console.log(
        'Driver cannot accpet this order.Order has already been assigned or is not pending anymore',
      );
      throw new HttpException(
        'Sorry the order has either been assigned or is not pending anymore',
        HttpStatus.BAD_REQUEST,
      );
    }
    order.driverId = driverId;
    return await Order.save(order);
  }

  async assignDriverToOrder(
    id: string,
    updateOrderDto: UpdateOrderDto,
  ): Promise<Order> {
    const { driverId } = updateOrderDto;
    const order = await Order.findOne(id);
    if (!order)
      throw new HttpException('Order Not Found', HttpStatus.NOT_FOUND);

    if (!(await order.isPending())) {
      throw new HttpException(
        'You cannot reassign a driver when the order is completed or cancelled',
        HttpStatus.BAD_REQUEST,
      );
    }
    // Send sms/notification to new driver
    order.driverId = driverId;
    return await Order.save(order);
  }
}
