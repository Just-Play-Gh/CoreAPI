import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { CustomerController } from './customer.controller';
import { CustomerService } from './customer.service';
import { RatingsModule } from './ratings/ratings.module';

@Module({
  controllers: [CustomerController],
  exports: [CustomerService],
  providers: [CustomerService],
  imports: [AuthModule, CustomerModule, RatingsModule],
})
export class CustomerModule {}
