import { Injectable, Logger } from '@nestjs/common';
import { Like } from 'typeorm';
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

  // async search(param) {
  //   try {
  //     Logger.log('searching customer...', param);
  //     const customer = await Customer.find({
  //       where: [
  //         { email: Like(`%${param.searchKey}%`) },
  //         { phoneNumber: Like(`%${param.searchKey}%`) },
  //       ],
  //     });
  //     return customer;
  //   } catch (error) {
  //     Logger.log('error searching for customer', error);
  //     throw error;
  //   }
  // }
}
