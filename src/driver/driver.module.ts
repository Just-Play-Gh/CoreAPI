import { Module } from '@nestjs/common';
import { DriverService } from './driver.service';
import { DriverController } from './driver.controller';
import { RatingsModule } from '../customer/ratings/ratings.module';
import { RatingsSummaryModule } from './ratings-summary/ratings-summary.module';

@Module({
  imports: [RatingsModule, RatingsSummaryModule],
  controllers: [DriverController],
  providers: [DriverService],
})
export class DriverModule {}
