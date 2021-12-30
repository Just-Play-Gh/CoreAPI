import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { AppGateway } from 'src/app.gateway';
import { OrderAcceptedEvent } from '../events/order-accepted.event';
import { OrderCreatedEvent } from '../events/order-created.event';

@Injectable()
export class OrderEventListeners {
  constructor(private readonly appGateway: AppGateway) {}
  @OnEvent('order.created')
  handleOrderCreated(event: OrderCreatedEvent) {
    this.appGateway.server.emit(`${event.customerId}_order`, event);
    console.log(event);
  }
  @OnEvent('order.accepted')
  handleOrderAccepted(event: OrderAcceptedEvent) {
    this.appGateway.server.emit(`${event.customerId}_order`, event);
    console.log(event);
  }
}
