import { Module } from '@nestjs/common';
import { RatingsModule } from './ratings/ratings.module';
import { RatingsSummaryModule } from './ratings-summary/ratings-summary.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [RatingsModule, RatingsSummaryModule, AuthModule],
})
export class DriverModule {}
