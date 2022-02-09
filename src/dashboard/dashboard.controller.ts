import { Controller, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { DashboardService } from './dashboard.service';

@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @UseGuards(JwtAuthGuard)
  async getAllUsers() {
    return await this.dashboardService.adminDashboard();
  }

  @UseGuards(JwtAuthGuard)
  async getDailyOrderCount(@Query() params) {
    return await this.dashboardService.getDailyTotalOrder(params.date);
  }

  @UseGuards(JwtAuthGuard)
  async getDailylCustomerCount(@Query() params) {
    return await this.dashboardService.getDailyTotalNewCustomers(params.date);
  }
}
