import { Injectable } from '@nestjs/common';
import { Order } from 'src/order/entities/order.entity';

@Injectable()
export class ReportsService {
  async orderReport() {
    const report = Order.find();
  }
  async driverReport() {
    const report = Order.find();
  }
}
