import { Injectable } from '@nestjs/common';
import { BaseService } from '../resources/base.service';
import { Customer } from './entities/customer.entity';

@Injectable()
export class CustomerService extends BaseService {
  constructor() {
    super(Customer);
  }
}
