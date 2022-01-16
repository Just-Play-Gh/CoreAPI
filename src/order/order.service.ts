import { HttpService } from '@nestjs/axios';
import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import {
  IPaginationOptions,
  paginate,
  Pagination,
} from 'nestjs-typeorm-paginate';
import { Product } from 'src/product/entities/product.entity';
import { BaseService } from 'src/resources/base.service';
import { createQueryBuilder } from 'typeorm';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { OrderLog, OrderLogEventMessages } from './entities/order-logs.entity';
import { Order, OrderStatusType } from './entities/order.entity';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { OrderCreatedEvent } from './events/order-created.event';
import { OrderAcceptedEvent } from './events/order-accepted.event';
import { NotificationService } from 'src/notification/notification.service';
import { OrderEventNames } from './order-event-names';

@Injectable()
export class OrderService extends BaseService {
  constructor(
    private readonly httpService: HttpService,
    private eventEmitter: EventEmitter2,
    private notificationService: NotificationService,
  ) {
    super(Order);
  }

  async store(createOrderDto: CreateOrderDto, customer): Promise<Order> {
    if (customer.role !== 'customer') {
      throw new HttpException(
        'You are not authorised to perform this action',
        HttpStatus.UNAUTHORIZED,
      );
    }
    const product = await Product.findOne({
      id: createOrderDto.productId,
    });
    if (!product) {
      console.log('Product not found');
      throw new HttpException('Product not found', HttpStatus.BAD_REQUEST);
    }
    try {
      // Create order
      const order = Order.create(createOrderDto);
      order.orderId = new Date().toISOString().replace(/\D/g, '');
      order.status = OrderStatusType.Pending;
      order.customerId = createOrderDto.customerId || customer.id;
      order.pricePerLitre = product.pricePerLitre;
      order.scheduleDate = createOrderDto.scheduleDate;
      order.totalAmount = order.amount; // +taxes
      order.customerFullName =
        createOrderDto.customerFullName ||
        customer.firstName + ' ' + customer.lastName;
      const createdOrder = await Order.save(order).catch((err) => {
        throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
      });

      await this.eventEmitter.emit(
        OrderEventNames.Created,
        new OrderCreatedEvent().fire(order),
      );
      createdOrder.createLog(OrderLogEventMessages.Created).catch((err) => {
        console.log('An error occured while creating event log');
        throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
      });
      return createdOrder;
    } catch (error) {
      console.log(error);
      throw new HttpException('Sorry an error occured', HttpStatus.BAD_REQUEST);
    }
  }

  async getOrders(
    options: IPaginationOptions,
    filter = {},
  ): Promise<Pagination<Order>> {
    const orderRepository = createQueryBuilder(Order)
      .where(filter)
      .orderBy({ created: 'DESC' });

    const orders = await paginate<Order>(orderRepository, options);
    if (!orders['items'])
      throw new HttpException('No orders were found', HttpStatus.NOT_FOUND);
    return orders;
  }

  async acceptOrder(driver, orderId: string): Promise<Order> {
    const order = await Order.findOne(orderId);
    if (!order)
      throw new HttpException('Order Not Found', HttpStatus.NOT_FOUND);

    if (order.isPending() || order.hasBeenAssigned()) {
      Logger.log(
        'Cannot accept this order. Order has already been assigned or is no longer available',
        order,
      );
      throw new HttpException(
        'Sorry the order has either been assigned or is no longer available',
        HttpStatus.BAD_REQUEST,
      );
    }
    order.driverId = driver.id;
    const acceptedOrder = await Order.save(order);
    if (acceptedOrder.driverId) {
      const orderAcceptedEvent = new OrderAcceptedEvent();
      orderAcceptedEvent.latlong = order.latlong;
      orderAcceptedEvent.driverId = order.driverId;
      orderAcceptedEvent.customerId = order.customerId;
      this.eventEmitter.emit(OrderEventNames.Accepted, orderAcceptedEvent);
      acceptedOrder.createLog(OrderLogEventMessages.Accepted).catch((err) => {
        console.log('An error occured while creating event log', err);
      });
    }
    return acceptedOrder;
  }

  // For admins to reassign a driver to the order
  async assignDriverToOrder(
    id: string,
    updateOrderDto: UpdateOrderDto,
  ): Promise<Order> {
    const { driverId } = updateOrderDto;
    const order = await Order.findOne(id);
    if (!order)
      throw new HttpException('Order Not Found', HttpStatus.NOT_FOUND);

    if (!(await order.isPending())) {
      Logger.log('You can only assign an order that is pending', order);
      throw new HttpException(
        'Unable to reassign a driver when the order is completed or cancelled',
        HttpStatus.BAD_REQUEST,
      );
    }
    // Send sms/notification to new driver
    order.driverId = driverId;
    const assignedOrder = await Order.save(order);
    if (!assignedOrder.driverId) {
      // Should not fail, put in a queue or something and process really quickly and allow it to retry. A fifo queue maybe?
      assignedOrder.createLog(OrderLogEventMessages.Assigned).catch((err) => {
        console.log('An error occured while creating event log');
        throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
      });
    }
    return assignedOrder;
  }

  // Check if is customer first and then check if customer owns this

  async cancelOrder(order: Order): Promise<Order> {
    const cancelledOrder = await order.cancel();
    // Disconnect or kill all running events
    this.eventEmitter.emit(OrderEventNames.Cancelled, { id: order.id });
    cancelledOrder.createLog(OrderLogEventMessages.Cancelled).catch((err) => {
      console.log('An error occured while creating event log');
      throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
    });
    return cancelledOrder;
  }

  async completeOrder(order: Order): Promise<Order> {
    const completedOrder = await order.complete();
    this.eventEmitter.emit(OrderEventNames.Completed, { id: order.id });
    completedOrder.createLog(OrderLogEventMessages.Completed).catch((err) => {
      console.log(
        'An error occured while creating event log for order completed',
      );
      throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
    });
    return completedOrder;
  }

  async getOrderLogs(orderId): Promise<OrderLog[]> {
    const orderLogs = await OrderLog.find({ orderId: orderId.id });
    if (!orderLogs)
      throw new HttpException('Order logs not found', HttpStatus.NOT_FOUND);
    return orderLogs;
  }
}
