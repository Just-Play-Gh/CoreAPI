import { Module } from '@nestjs/common';
import { RatingsModule } from './ratings/ratings.module';

@Module({
  imports: [RatingsModule],
})
export class DriverModule {}
