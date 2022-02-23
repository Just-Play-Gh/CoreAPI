import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { ReportsService } from './reports.service';

@Controller('reports')
export class ReportsController {
  constructor(private readonly reportService: ReportsService) {}

  @Get('/report')
  @UseGuards(JwtAuthGuard)
  async orderReport(@Param() params) {
    return await this.reportService.orderReport(
      params.startDate,
      params.endDate,
      params.limit,
    );
  }
}
