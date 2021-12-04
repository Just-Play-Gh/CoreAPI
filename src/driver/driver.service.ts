import { Injectable } from '@nestjs/common';

@Injectable()
export class DriverService {
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
}
