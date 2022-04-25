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
import { OrderEventNames } from './order-event-names';
import { Driver } from 'src/driver/entities/driver.entity';
import {
  Geofence,
  GeofenceStatus,
} from 'src/geofence/entities/geofence.entity';
import { InjectRedis, Redis } from '@nestjs-modules/ioredis';

@Injectable()
export class OrderService extends BaseService {
  constructor(
    private eventEmitter: EventEmitter2,
    @InjectRedis() private readonly redis: Redis,
  ) {
    super(Order);
  }

  async store(createOrderDto: CreateOrderDto): Promise<Order> {
    const product = await Product.findOne({
      id: createOrderDto.productId,
    });
    if (!product) {
      console.log('Product not found');
      throw new HttpException('Product not found', HttpStatus.BAD_REQUEST);
    }
    try {
      console.log(createOrderDto);
      const order = await Order.create(createOrderDto);
      order.orderId = new Date().toISOString().replace(/\D/g, '');
      order.status = OrderStatusType.Pending;
      order.customerId = createOrderDto.customerId;
      order.pricePerLitre = product.pricePerLitre;
      order.scheduleDate = createOrderDto.scheduleDate;
      order.totalAmount = order.amount; // +taxes
      order.litres = order.amount / product.pricePerLitre; // +taxes
      order.customerFullName = createOrderDto.customerFullName;
      const createdOrder = await Order.save(order).catch((err) => {
        console.log('An error occured while saving an order', err);
        throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
      });

      await this.eventEmitter.emit(
        OrderEventNames.Created,
        new OrderCreatedEvent().fire(createdOrder),
      );
      createdOrder
        .createLog(OrderLogEventMessages.Created, OrderEventNames.Created)
        .catch((err) => {
          console.log('An error occured while creating event log', err);
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
    const orderRepository = createQueryBuilder(Order, 'orders')
      .where(filter)
      .leftJoinAndSelect('orders.driver', 'drivers')
      .leftJoinAndSelect('orders.product', 'products')
      .leftJoinAndSelect('orders.orderDevice', 'devices')
      // .where('orders.driverId = drivers.id')
      .orderBy({ 'orders.created': 'DESC' });

    const orders = await paginate<Order>(orderRepository, options);
    if (!orders['items'])
      throw new HttpException('No orders were found', HttpStatus.NOT_FOUND);
    return orders;
  }

  async acceptOrder(driver: Driver, orderId: string): Promise<Order> {
    Logger.log('Accepting order', { driver, orderId });
    const order = await Order.findOne(orderId);
    if (!order) {
      Logger.log('Order not found', driver, order);
      throw new HttpException('Order Not Found', HttpStatus.NOT_FOUND);
    }
    if (!(await order.isPending()) || (await order.hasBeenAssigned())) {
      Logger.log(
        'Cannot accept this order. Order has already been assigned or is no longer available',
        order,
      );
      throw new HttpException(
        'Sorry the order has either been assigned or is no longer available',
        HttpStatus.BAD_REQUEST,
      );
    }
    order.driverId = driver.id.toString();
    order.status = OrderStatusType.InProgress;
    const acceptedOrder = await Order.save(order);
    if (acceptedOrder.driverId) {
      this.eventEmitter.emit(OrderEventNames.Accepted, { order, driver });
      acceptedOrder
        .createLog(OrderLogEventMessages.Accepted, OrderEventNames.Accepted)
        .catch((err) => {
          console.log('An error occured while creating event log', err);
        });
    }
    return acceptedOrder;
  }

  // For admins to reassign a driver to the order
  async updateOrder(
    orderId: string,
    updateOrderDto: UpdateOrderDto,
  ): Promise<Order> {
    const { driverId } = updateOrderDto;
    const order = await Order.findOne({ orderId: orderId });
    if (!order) {
      Logger.log('Order not found', order);
      throw new HttpException('Order Not Found', HttpStatus.NOT_FOUND);
    }
    if (
      order.latlong !== updateOrderDto.latlong ||
      !(await this.checkIfLatlongIsInAGeofence(updateOrderDto.latlong))
    ) {
      Logger.log('OUT_OF_BOUNDS', {
        request: updateOrderDto,
      });
      throw new HttpException(
        'Sorry, we are currently not available in the given location',
        HttpStatus.SERVICE_UNAVAILABLE,
      );
    }
    if (
      (await order.isCompleted()) ||
      (await order.isCancelled()) ||
      (await order.isNotAccepted())
    ) {
      Logger.log(
        'You cannot edit an order that has been cancelled, completed or not accepted by any driver',
        order,
      );
      throw new HttpException(
        'Unable to reassign a driver when the order is completed, cancelled or not accepted by any driver',
        HttpStatus.BAD_REQUEST,
      );
    }
    // Send sms/notification to new driver
    if (order.driverId !== driverId) {
      Logger.log('Sending sms/notification to new driver', {});
      order.driverId = driverId;
      order.status = OrderStatusType.Pending;
      this.eventEmitter.emit(OrderEventNames.Reassigned, { order, driverId });
      order
        .createLog(OrderLogEventMessages.Reassigned, OrderEventNames.Reassigned)
        .catch((err) => {
          console.log('An error occured while creating event log', err);
        });
    }
    return await Order.save(order);
  }

  // Check if is customer first and then check if customer owns this

  async cancelOrder(order: Order): Promise<Order> {
    const cancelledOrder = await order.cancel();
    // Disconnect or kill all running events
    this.eventEmitter.emit(OrderEventNames.Cancelled, { ...order });
    cancelledOrder
      .createLog(OrderLogEventMessages.Cancelled, OrderEventNames.Cancelled)
      .catch((err) => {
        console.log('An error occured while creating event log');
        throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
      });
    return cancelledOrder;
  }

  async completeOrder(order: Order): Promise<Order> {
    const completedOrder = await order.complete();
    const driver = await Driver.findOne({ id: +order.driverId });
    this.eventEmitter.emit(OrderEventNames.Completed, { order, driver });
    completedOrder
      .createLog(OrderLogEventMessages.Completed, OrderEventNames.Completed)
      .catch((err) => {
        console.log(
          'An error occured while creating event log for order completed',
        );
        throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
      });
    return completedOrder;
  }

  async getOrderLogs(orderId: { id: string }): Promise<OrderLog[]> {
    const orderLogs = await OrderLog.find({ orderId: orderId.id });
    return orderLogs;
  }

  async checkIfLatlongIsInAGeofence(
    customerLocation: string,
  ): Promise<boolean> {
    const geofences = await Geofence.find({ status: GeofenceStatus.Active }); // @TODO pick in small chucks in case data grows
    Logger.debug('Geofences', JSON.stringify(geofences));
    if (geofences.length) {
      for (const geofence of geofences) {
        Logger.debug('Checking geofence', { geofence });
        const geoLatLong = geofence.focusPoint.replace(/ /g, '').split(',');
        const focusPointLatitude = +geoLatLong[1];
        const focusPointLongitude = +geoLatLong[0];
        const customerLatLong = customerLocation.split(',');
        const customerLatitude = +customerLatLong[1];
        const customerLongitude = +customerLatLong[0];
        const customerPoint = 'user:' + customerLocation; // Should be unique
        const focusPoint = 'focuspoint:' + geofence.name;
        await this.redis.geoadd(
          focusPoint,
          focusPointLongitude,
          focusPointLatitude,
          geofence.name,
          customerLongitude,
          customerLatitude,
          customerPoint,
        );
        Logger.debug(
          'Geofences after geoadd',
          JSON.stringify(customerLatitude),
        );
        const distance = await this.redis.geodist(
          focusPoint,
          geofence.name,
          customerPoint,
          'km',
        );
        Logger.debug('After geodist', JSON.stringify(distance));
        if (distance <= geofence.radius) {
          this.redis.zrem(focusPoint, customerPoint);
          Logger.debug(
            'geofence is within range',
            JSON.stringify(customerPoint),
          );
          return true;
        }
      }
      Logger.debug('Returned false');

      return false;
    }
    Logger.debug('No active geofences have been found');
    return false;
  }
}
