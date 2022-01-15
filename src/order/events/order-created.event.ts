export class OrderCreatedEvent {
  orderId: string;
  customerId: string;
  driverId: string;
  latlong: string;
  timeout: number;

  fire(order) {
    const timeout = +process.env.ORDER_ACCEPT_TIMEOUT || 12;
    this.latlong = order.latlong;
    this.driverId = order.driverId;
    this.customerId = order.customerId;
    this.orderId = order.orderId;
    this.timeout = timeout * 1000;
    return this;
  }
}
