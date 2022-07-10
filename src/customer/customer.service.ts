import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import {
  IPaginationOptions,
  paginate,
  Pagination,
} from 'nestjs-typeorm-paginate';
import { entityResource } from 'src/helpers/generator';
import { createQueryBuilder, Like } from 'typeorm';
import { BaseService } from '../resources/base.service';
import { Customer } from './entities/customer.entity';

@Injectable()
export class CustomerService extends BaseService {
  constructor() {
    super(Customer);
  }
  async paginate(
    options: IPaginationOptions,
    searchParams = {},
  ): Promise<Pagination<Customer>> {
    let customerRepository;
    if (searchParams) {
      customerRepository = createQueryBuilder(Customer).where(searchParams);
      // .withDeleted();
    } else {
      customerRepository = createQueryBuilder(Customer).withDeleted();
    }
    const customers = await paginate<Customer>(customerRepository, options);
    if (!customers['items'])
      throw new HttpException('No customers were found', HttpStatus.NOT_FOUND);
    return customers;
  }
  async updateProfileDto(updateProfileDto, user: Customer) {
    const customer = await Customer.findOne({ id: user.id });
    for (const key in updateProfileDto) {
      customer[key] = updateProfileDto[key];
    }
    return entityResource(await customer.save());
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
