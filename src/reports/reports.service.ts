import { Injectable, Logger } from '@nestjs/common';
import { paginate } from 'nestjs-typeorm-paginate';
import { Order } from 'src/order/entities/order.entity';

@Injectable()
export class ReportsService {
  async orderReport(startDate, endDate) {
    try {
      const report = Order.find();
    } catch (error) {
      Logger.error(error);
    }
  }
}
