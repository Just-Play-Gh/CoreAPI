import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import {
  IPaginationOptions,
  paginate,
  Pagination,
} from 'nestjs-typeorm-paginate';
import { createQueryBuilder } from 'typeorm';
import { CreateTruckDto } from './dto/create-truck.dto';
import { UpdateTruckDto } from './dto/update-truck.dto';
import { Truck } from './entities/truck.entity';

@Injectable()
export class TruckService {
  async getTrucks(
    options: IPaginationOptions,
    filter = {},
  ): Promise<Pagination<Truck>> {
    const deviceRepository = createQueryBuilder(Truck)
      .where(filter)
      .orderBy({ created: 'DESC' });

    const trucks = await paginate<Truck>(deviceRepository, options);
    if (!trucks['items'])
      throw new HttpException('No trucks were found', HttpStatus.NOT_FOUND);
    return trucks;
  }
  async create(createTruckDto: CreateTruckDto) {
    try {
      const truck = await Truck.create(createTruckDto);
      return await Truck.save(truck);
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

  findAll() {
    return `This action returns all truck`;
  }

  findOne(id: number) {
    return `This action returns a #${id} truck`;
  }

  update(id: number, updateTruckDto: UpdateTruckDto) {
    return `This action updates a #${id} truck`;
  }

  remove(id: number) {
    return `This action removes a #${id} truck`;
  }
}
