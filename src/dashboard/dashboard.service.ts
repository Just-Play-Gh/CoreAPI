import { Injectable } from '@nestjs/common';
import {
  Customer,
  UserStatusType,
} from 'src/customer/entities/customer.entity';
import { Driver, StatusType } from 'src/driver/entities/driver.entity';

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
    //   const
  }
}
