import { Driver } from 'src/driver/entities/driver.entity';
import { Order } from '../entities/order.entity';

export class EventDriver {
  name: string;
  phoneNumber: string;
  driverId: string;
  driverPhoneNumber: number;
}
export class OrderAcceptedEvent {
  order: Order;
  driver: Driver;
}
