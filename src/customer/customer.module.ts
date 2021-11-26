import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { CustomerController } from './customer.controller';
import { CustomerService } from './customer.service';
import { RatingsModule } from './ratings/ratings.module';
import { RatingsSummaryModule } from './ratings-summary/ratings-summary.module';

@Module({
  controllers: [CustomerController],
  exports: [CustomerService],
  providers: [CustomerService],
  imports: [AuthModule, CustomerModule, RatingsModule, RatingsSummaryModule],
})
export class CustomerModule {}
