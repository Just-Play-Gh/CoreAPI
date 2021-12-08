import { Injectable } from '@nestjs/common';
import { CountryCode, parsePhoneNumber } from 'libphonenumber-js';
import { GetDriverByPhoneNumberDto } from './dto/get-driver.dto';
import { Driver, StatusType } from './entities/driver.entity';

@Injectable()
export class DriverService {
  async getDriverByPhoneNumber(
    getDriverDto: GetDriverByPhoneNumberDto,
  ): Promise<Driver> {
    const { phoneNumber } = getDriverDto;
    const parsePhone = parsePhoneNumber(
      phoneNumber,
      'GH' as CountryCode,
    ).number.substring(1);
    return Driver.findOne(
      { phoneNumber: String(parsePhone), status: StatusType.Active },
      { relations: ['ratings_summary'] },
    );
  }
}
