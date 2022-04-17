import { Driver } from 'src/driver/entities/driver.entity';
import { User } from 'src/users/entities/user.entity';
import { Order } from '../entities/order.entity';

export class EventDriver {
  name: string;
  phoneNumber: string;
  driverId: string;
  driverPhoneNumber: number;
}
export class OrderAssignedEvent {
  order: Order;
  driver: Driver;
  user: User;
}
