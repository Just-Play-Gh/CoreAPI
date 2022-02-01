import { Controller, Param } from '@nestjs/common';
import { ReportsService } from './reports.service';

@Controller('reports')
export class ReportsController {
  constructor(private readonly reportService: ReportsService) {}
  async orderReport(@Param() params) {
    return await this.reportService.orderReport(
      params.startDate,
      params.endDate,
      params.limit,
    );
  }
}
