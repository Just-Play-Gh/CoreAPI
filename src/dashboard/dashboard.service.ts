import { Injectable, Logger } from '@nestjs/common';
import {
  Customer,
  UserStatusType,
} from 'src/customer/entities/customer.entity';
import { Driver, StatusType } from 'src/driver/entities/driver.entity';
import { Order, OrderStatusType } from 'src/order/entities/order.entity';
import { Like } from 'typeorm';

@Injectable()
export class DashboardService {
  async adminDashboard() {
    const totalDriver = await Driver.count();
    const totalActiveDriver = await Driver.count({ status: StatusType.Active });
    const totalCustomers = await Customer.count();
    const totalActifCustomers = await Customer.count({
      status: UserStatusType.Active,
    });

    return {
      totalDriver: totalDriver,
      totalActiveDriver: totalActiveDriver,
      totalCustomers: totalCustomers,
      totalActifCustomers: totalActifCustomers,
    };
  }

  async getDailyTotalOrder(date) {
    // const today = dayjs().format('YYYY-MM-DD');
    try {
      const report = await Order.count({
        where: [{ orderDate: date }, { status: OrderStatusType.Completed }],
      });
      return report;
    } catch (error) {
      Logger.error('error getting daily total order', error);
      throw error;
    }
  }

  async getDailyTotalNewCustomers(date) {
    try {
      const totalCustomers = await Customer.count({ created: Like(date) });
      return totalCustomers;
    } catch (error) {
      Logger.error('error getting daily total customer', error);
      throw error;
    }
  }

  async getDriver(date) {
    try {
      const totalCustomers = await Customer.count({ created: Like(date) });
      return totalCustomers;
    } catch (error) {
      Logger.error('error getting daily total customer', error);
      throw error;
    }
  }
}
