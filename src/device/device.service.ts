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

  async getDevices(
    options: IPaginationOptions,
    filter = {},
  ): Promise<Pagination<Device>> {
    const deviceRepository = createQueryBuilder(Device)
      .where(filter)
      .orderBy({ created: 'DESC' });

    const orders = await paginate<Device>(deviceRepository, options);
    if (!orders['items'])
      throw new HttpException('No devices were found', HttpStatus.NOT_FOUND);
    return orders;
  }
}
