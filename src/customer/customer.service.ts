import { Injectable } from '@nestjs/common';
import { BaseService } from '../resources/base.service';
import { Customer } from './entities/customer.entity';

@Injectable()
export class CustomerService extends BaseService {
  constructor() {
    super(Customer);
  }

  async updateProfileDto(updateProfileDto, user: Customer) {
    const customer = await Customer.findOne({ id: user.id });
    for (const key in updateProfileDto) {
      customer[key] = updateProfileDto[key];
    }
    return await customer.save();
  }
}
