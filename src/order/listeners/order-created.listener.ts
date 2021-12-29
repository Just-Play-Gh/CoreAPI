import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { OrderCreatedEvent } from '../events/order-created.event';

@Injectable()
export class OrderCreatedListener {
  @OnEvent('order.created')
  handle(event: OrderCreatedEvent) {
    // handle and process "OrderCreatedEvent" event
    console.log('here');
    console.log(event);
  }
}
