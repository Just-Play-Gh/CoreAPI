import { Module } from '@nestjs/common';
import { RatingsModule } from './ratings/ratings.module';
import { RatingsSummaryModule } from './ratings-summary/ratings-summary.module';

@Module({
  imports: [RatingsModule, RatingsSummaryModule],
})
export class DriverModule {}
