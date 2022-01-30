import { Injectable, Logger } from '@nestjs/common';
import { Order } from 'src/order/entities/order.entity';
import { Between } from 'typeorm';

@Injectable()
export class ReportsService {
  async orderReport(startDate, endDate, limit) {
    try {
      if (limit > +process.env.RECORD_LIMIT) {
        return 'processing report ... it will be sent to you email shortly.';
      }
      const report = Order.find({
        where: {
          orderDate: Between(startDate.toISOString(), endDate.toISOString()),
        },
      });
      return report;
    } catch (error) {
      Logger.error(error);
    }
  }
}
