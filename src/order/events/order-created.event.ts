export class OrderCreatedEvent {
  orderId: string;
  transactionId: string;
  customerId: string;
  driverId: string;
  latlong: string;
  timeout: number;

  fire(order) {
    const timeout = +process.env.ORDER_ACCEPT_TIMEOUT || 12;
    this.latlong = order.latlong;
    this.driverId = order.driverId;
    this.customerId = order.customerId;
    this.orderId = order.id;
    this.transactionId = order.orderId;
    this.timeout = timeout * 1000;
    return this;
  }
}
