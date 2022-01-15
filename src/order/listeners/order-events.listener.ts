import { InjectRedis, Redis } from '@nestjs-modules/ioredis';
import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { AppGateway } from 'src/app.gateway';
import { DriverService } from 'src/driver/driver.service';
import { OrderAcceptedEvent } from '../events/order-accepted.event';
import { OrderCreatedEvent } from '../events/order-created.event';
import { OrderEventNames } from '../order-event-names';

@Injectable()
export class OrderEventListeners {
  orderAcceptedKey = 'order_accepted';
  constructor(
    private readonly appGateway: AppGateway,
    private readonly driverService: DriverService,
    @InjectRedis() private readonly redis: Redis,
  ) {}

  @OnEvent(OrderEventNames.Created)
  async handleOrderCreated(event: OrderCreatedEvent) {
    console.log(event);
    const channelName = `${event.customerId}_order`;
    this.appGateway.server.emit(channelName, event);
    this.pushToDrivers(event);
    return true;
  }

  @OnEvent(OrderEventNames.Cancelled)
  handleOrderCancelledEvent(event) {
    const channelName = `${event.driverId}_order`;
    console.log(channelName);
    this.appGateway.server.emit(channelName, event);
  }
  @OnEvent(OrderEventNames.Accepted)
  handleOrderAccepted(event: OrderAcceptedEvent) {
    this.appGateway.server.emit(`${event.customerId}_order`, event);
    this.redis.set(this.orderAcceptedKey + event.orderId);
    console.log(event);
  }

  async pushToDrivers(event: OrderCreatedEvent) {
    const customerLocation = event.latlong;
    const closestDrivers = await this.driverService.getClosestDriver(
      customerLocation,
    );
    const sortedDistance = closestDrivers['sortedDistance'];
    const sortedDriverIds = closestDrivers['sortedDrivers'];
    for (const distance of sortedDistance) {
      const channelName = sortedDriverIds[distance] + '_order';
      this.appGateway.server.emit(channelName, event);
      await this.sleep(event.timeout);
      if (this.redis.get(this.orderAcceptedKey + event.orderId)) {
        console.log('Order accepted');
        break;
      }
    }
    // No one accepted
  }
  async sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
