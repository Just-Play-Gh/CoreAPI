import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { AppGateway } from 'src/app.gateway';
import { DriverService } from 'src/driver/driver.service';
import { OrderAcceptedEvent } from '../events/order-accepted.event';
import { OrderCreatedEvent } from '../events/order-created.event';
import { PushOrderToDriverEvent } from '../events/push-order-to-driver-event';

@Injectable()
export class OrderEventListeners {
  constructor(
    private readonly appGateway: AppGateway,
    private readonly driverService: DriverService,
  ) {}
  @OnEvent('order.created')
  async handleOrderCreated(event: OrderCreatedEvent) {
    const channelName = `${event.customerId}_order`;
    const customerLocation = event.latlong;
    this.appGateway.server.emit(channelName, event);

    const closestDrivers = await this.driverService.getClosestDriver(
      customerLocation,
    );
    const sortedDistance = closestDrivers['sortedDistance'];
    const sortedDriverIds = closestDrivers['sortedDrivers'];
    sortedDistance.forEach(async (distance) => {
      const channelName = sortedDriverIds[distance] + '_order';
      this.appGateway.server.emit(channelName, event);
    });
  }

  @OnEvent('order.pushToDriver')
  handlePushOrderToDriverEvent(event: PushOrderToDriverEvent) {
    console.log('push to driver event');
    console.log(event.driverId);
    const channelName = `${event.driverId}_order`;
    console.log(channelName);
    this.appGateway.server.emit(channelName, event);
  }
  @OnEvent('order.cancelled')
  handleOrderCancelledEvent(event) {
    const channelName = `${event.driverId}_order`;
    console.log(channelName);
    this.appGateway.server.emit(channelName, event);
  }
  @OnEvent('order.accepted')
  handleOrderAccepted(event: OrderAcceptedEvent) {
    this.appGateway.server.emit(`${event.customerId}_order`, event);
    console.log(event);
  }
}
