import { Module } from '@nestjs/common';
import { CustomerController } from './customer.controller';
import { CustomerService } from './customer.service';
import { RatingsModule } from './ratings/ratings.module';
import { RatingsSummaryModule } from './ratings-summary/ratings-summary.module';
import { SharedModule } from 'src/shared/shared.module';

@Module({
  controllers: [CustomerController],
  exports: [CustomerService],
  providers: [CustomerService],
  imports: [CustomerModule, RatingsModule, RatingsSummaryModule, SharedModule],
})
export class CustomerModule {}
