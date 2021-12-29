import { Module } from '@nestjs/common';
import { CustomerController } from './customer.controller';
import { CustomerService } from './customer.service';
import { SharedModule } from 'src/shared/shared.module';

@Module({
  controllers: [CustomerController],
  exports: [CustomerService],
  providers: [CustomerService],
  imports: [CustomerModule, SharedModule],
})
export class CustomerModule {}
