import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import {
  IPaginationOptions,
  paginate,
  Pagination,
} from 'nestjs-typeorm-paginate';
import { Customer } from 'src/customer/entities/customer.entity';
import { BaseService } from 'src/resources/base.service';
import { createQueryBuilder } from 'typeorm';
import { CreateDeviceDto } from './dto/create-device.dto';
import { Device } from './entities/device.entity';

@Injectable()
export class DeviceService extends BaseService {
  constructor() {
    super(Device);
  }

  async store(createDeviceDto: CreateDeviceDto[], customer: Customer) {
    try {
      await createDeviceDto.map((device) => {
        device.customerId = customer.id;
        device.alias = device.name;
      });
      const devices = await Device.create(createDeviceDto);
      return await Device.save(devices);
    } catch (error: any) {
      if (error.code === 'ER_DUP_ENTRY') {
        throw new HttpException(
          'Record already exists',
          HttpStatus.UNPROCESSABLE_ENTITY,
        );
      }
      throw error;
    }
  }

  async myDevices(customer: Customer, query: { page: number; limit: number }) {
    try {
      const { limit = 10, page = 1 } = query;
      const deviceRepository = createQueryBuilder(Device)
        .where({ customerId: customer.id })
        .orderBy({ created: 'DESC' });
      return await paginate<Device>(deviceRepository, { limit, page });
    } catch (error: any) {
      throw error;
    }
  }
}
