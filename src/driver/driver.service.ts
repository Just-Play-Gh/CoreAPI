import { Injectable } from '@nestjs/common';
import { CountryCode, parsePhoneNumber } from 'libphonenumber-js';
import { GetDriverByPhoneNumberDto } from './dto/get-driver.dto';
import { Driver } from './entities/driver.entity';

@Injectable()
export class DriverService {}
