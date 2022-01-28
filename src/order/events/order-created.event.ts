import { Order } from '../entities/order.entity';

export class OrderCreatedEvent {
  id: number;
  orderId: number;
  transactionId: string;
  customerId: string;
  driverId: string;
  device: string;
  litres: number;
  productId: number;
  channel: string;
  totalAmount: number;
  address: string;
  latlong: string;
  timeout: number;
  incomingOrder: boolean;
  driverNotFound: boolean;

  fire(order: Order) {
    const timeout = +process.env.ORDER_ACCEPT_TIMEOUT || 12;
    this.latlong = order.latlong;
    this.driverId = order.driverId;
    this.customerId = order.customerId;
    this.id = order.id;
    this.transactionId = order.orderId;
    this.timeout = timeout * 1000;
    this.address = order.address;
    this.litres = order.litres;
    this.productId = order.productId;
    this.device = order.device;
    this.channel = order.channel;
    this.totalAmount = order.totalAmount;
    this.incomingOrder = true;
    this.driverNotFound = false;
    return this;
  }
}
