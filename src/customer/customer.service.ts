import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CountryCode, parsePhoneNumber } from 'libphonenumber-js';
import { BaseService } from 'src/resources/base.service';
import { ChangePasswordDto } from './dto/change-password.dto';
import { GetCustomerByEmailDto } from './dto/get-customer-by-email.dto';
import { GetCustomerByPhoneNumberDto } from './dto/get-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { Customer, StatusType } from './entities/customer.entity';

@Injectable()
export class CustomerService extends BaseService {
  constructor() {
    super(Customer);
  }
}
