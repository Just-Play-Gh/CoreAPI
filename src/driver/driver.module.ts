import { Module } from '@nestjs/common';
import { DriverService } from './driver.service';
import { DriverController } from './driver.controller';
import { RatingsModule } from '../customer/ratings/ratings.module';
import { RatingsSummaryModule } from './ratings-summary/ratings-summary.module';
import { SharedModule } from 'src/shared/shared.module';

@Module({
  imports: [RatingsModule, RatingsSummaryModule, SharedModule],
  controllers: [DriverController],
  providers: [DriverService],
})
export class DriverModule {}
