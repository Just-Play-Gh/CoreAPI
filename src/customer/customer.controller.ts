import { Controller } from '@nestjs/common';
import { CustomerService } from './customer.service';
import { BaseController } from '../resources/base.controller';

@Controller('customers')
export class CustomerController extends BaseController {
  constructor(private readonly customerService: CustomerService) {
    super(customerService);
  }
}
