import { Controller, Param, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { ReportsService } from './reports.service';

@Controller('reports')
export class ReportsController {
  constructor(private readonly reportService: ReportsService) {}

  @UseGuards(JwtAuthGuard)
  async orderReport(@Param() params) {
    return await this.reportService.orderReport(
      params.startDate,
      params.endDate,
      params.limit,
    );
  }
}
