import { Module } from '@nestjs/common';
import { CustomerController } from './customer.controller';
import { CustomerService } from './customer.service';
import { SharedModule } from 'src/shared/shared.module';
import { AuthenticationService } from 'src/authentication/authentication.service';

@Module({
  controllers: [CustomerController],
  exports: [CustomerService],
  providers: [CustomerService, AuthenticationService],
  imports: [CustomerModule, SharedModule],
})
export class CustomerModule {}
