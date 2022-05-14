import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { paginate } from 'nestjs-typeorm-paginate';
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
      const deviceRepository = createQueryBuilder(Device, 'devices')
        .where({ customerId: customer.id })
        .leftJoinAndSelect('devices.order', 'order')
        .orderBy({ 'devices.created': 'DESC' });
      return await paginate<Device>(deviceRepository, { limit, page });
    } catch (error: any) {
      Logger.log('Get Devices Error', error);
      throw error;
    }
  }
  async test() {
    try {
      const deviceRepository = createQueryBuilder(Device, 'devices')
        .where({ customerId: 11 })
        .leftJoinAndSelect('devices.order', 'lastOrder')

        .orderBy({ 'devices.created': 'DESC' });

      return deviceRepository.getMany();
      // return await paginate<Device>(deviceRepository, { '1', '4' });
    } catch (error: any) {
      Logger.log('Get Devices Error', error);
      throw error;
    }
  }
}
