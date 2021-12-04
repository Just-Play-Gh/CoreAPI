import { Module } from '@nestjs/common';
import { DriverService } from './driver.service';
import { DriverController } from './driver.controller';
import { RatingsModule } from 'src/customer/ratings/ratings.module';
import { RatingsSummaryModule } from './ratings-summary/ratings-summary.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [RatingsModule, RatingsSummaryModule, AuthModule],
  controllers: [DriverController],
  providers: [DriverService],
})
export class DriverModule {}
