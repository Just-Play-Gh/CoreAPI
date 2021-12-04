import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CountryCode, parsePhoneNumber } from 'libphonenumber-js';
import { ChangePasswordDto } from './dto/change-password.dto';
import { GetCustomerByEmailDto } from './dto/get-customer-by-email.dto';
import { GetCustomerByPhoneNumberDto } from './dto/get-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { Customer } from './entities/customer.entity';

@Injectable()
export class CustomerService {
  async getCustomerByPhoneNumber(
    getCustomerDto: GetCustomerByPhoneNumberDto,
  ): Promise<Customer> {
    const { phoneNumber, country } = getCustomerDto;
    const parsePhone = parsePhoneNumber(
      phoneNumber,
      country as CountryCode,
    ).number.substring(1);
    return Customer.findOne({ phoneNumber: String(parsePhone), status: true });
  }

  async getCustomerByEmail(
    getCustomerByEmail: GetCustomerByEmailDto,
  ): Promise<Customer> {
    const customerDetails = {};
    for (const key in getCustomerByEmail) {
      customerDetails[key] = getCustomerByEmail[key];
    }
    return Customer.findOne({ ...customerDetails, status: true });
  }

  async updateCustomerByPhoneNumber(
    updateCustomerDto: UpdateCustomerDto,
  ): Promise<Customer> {
    const { phoneNumber } = updateCustomerDto;
    const customer = await Customer.findOne({ phoneNumber });
    delete updateCustomerDto.phoneNumber;
    for (const key in updateCustomerDto) {
      customer[key] = updateCustomerDto[key];
    }
    await Customer.save(customer);
    return customer;
  }

  async changePassword(
    changePasswordDto: ChangePasswordDto,
    customerPayload: Customer,
  ): Promise<{ message: string }> {
    const { currentPassword, newPassword, newPasswordConfirmation } =
      changePasswordDto;
    const { id } = customerPayload;
    try {
      const customer: Customer = await Customer.findOne({ id });
      if (!customer || !customer.validatePassword(currentPassword))
        throw new HttpException('Invalid Password', HttpStatus.BAD_REQUEST);
      if (newPassword !== newPasswordConfirmation)
        throw new HttpException(
          'Passwords do not match',
          HttpStatus.BAD_REQUEST,
        );
      customer.password = newPassword;
      await Customer.save(customer);
      return { message: 'Password changed successful' };
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}
