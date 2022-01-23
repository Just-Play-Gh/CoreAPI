import { InjectRedis, Redis } from '@nestjs-modules/ioredis';
import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { AppGateway } from 'src/app.gateway';
import { DriverService } from 'src/driver/driver.service';
import { NotificationService } from 'src/notification/notification.service';
import { Order, OrderStatusType } from '../entities/order.entity';
import { OrderAcceptedEvent } from '../events/order-accepted.event';
import { OrderCancelledEvent } from '../events/order-cancelled.event';
import { OrderCreatedEvent } from '../events/order-created.event';
import { OrderEventNames } from '../order-event-names';

@Injectable()
export class OrderEventListeners {
  orderAcceptedCacheKey = 'order_accepted';
  constructor(
    private readonly appGateway: AppGateway,
    private readonly driverService: DriverService,
    private readonly notificationService: NotificationService,
    @InjectRedis() private readonly redis: Redis,
  ) {}

  @OnEvent(OrderEventNames.Created)
  async handleOrderCreated(event: OrderCreatedEvent) {
    Logger.log('Order created event fired', event);
    const channelName = `${event.customerId}_order`;
    if (event.driverId) {
      console.log('Driver has been assigned to the order', event);
      return true;
    }
    Logger.log(`Emitting event to channel: ${channelName}`, event);
    this.appGateway.server.emit(channelName, event);
    this.pushToDrivers(event);
    return true;
  }
  @OnEvent(OrderEventNames.Cancelled)
  handleOrderCancelledEvent(event: OrderCancelledEvent) {
    if (event.driverId) {
      const channelName = `${event.driverId}_order`;
      this.appGateway.server.emit(channelName, event);
      this.redis.del(this.orderAcceptedCacheKey + event.orderId);
      return false;
    }
    Logger.log(`No driver was assigned this order`, event);
  }
  @OnEvent(OrderEventNames.Accepted)
  handleOrderAccepted(event: OrderAcceptedEvent) {
    this.appGateway.server.emit(`${event.order.customerId}_order`, event);
    this.redis.set(
      this.orderAcceptedCacheKey + event.order.orderId,
      1,
      'EX',
      60,
    );
  }

  @OnEvent(OrderEventNames.Completed)
  handleOrderCompleted(event: OrderAcceptedEvent) {
    this.appGateway.server.emit(`${event.order.customerId}_order`, event);
    console.log(event);
  }

  async pushToDrivers(event: OrderCreatedEvent) {
    const customerLocation = event.latlong;
    const closestDrivers = await this.driverService.getClosestDriver(
      customerLocation,
    );
    if (!closestDrivers) {
      Logger.log('No drivers found', closestDrivers);
      event.driverNotFound = true;
      this.appGateway.server.emit(`${event.customerId}_order`, event);
      this.handleOrderNotAccepted(event);
      return true;
    }
    Logger.log('Closest drivers', closestDrivers);
    const sortedDistance = closestDrivers['sortedDistance'];
    const sortedDriverIds = closestDrivers['sortedDrivers'];
    for (const distance of sortedDistance) {
      const channelName = sortedDriverIds[distance] + '_order';
      this.appGateway.server.emit(channelName, event);
      Logger.log('Order created event Pushed to Driver', {
        channelName,
        event,
      });
      await this.waitForDriverToAccept(event.timeout);
      if (await this.hasDriverAccepted(event.orderId)) {
        Logger.log('Driver accepted order', channelName);
        break;
      }
      Logger.log('Order was not accepted by any driver', {
        event,
        drivers: sortedDriverIds,
      });
    }
    this.handleOrderNotAccepted(event);
  }
  async handleOrderNotAccepted(event: OrderCreatedEvent) {
    const order = await Order.findOne({ id: event.id });
    if (order.status === OrderStatusType.Pending) {
      order.status = OrderStatusType.NotAccepted;
      order.save();
      order.createLog('No drivers found for your order.').catch((err) => {
        console.log('An error occured while creating an order event log');
        throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
      });
      this.appGateway.server.emit(`${event.customerId}_order`, order);
    }
  }
  async waitForDriverToAccept(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
  async hasDriverAccepted(orderId) {
    return await this.redis.get(this.orderAcceptedCacheKey + orderId);
  }
}
