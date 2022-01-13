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

  async update(id: number, updateUserDto: UpdateTruckDto) {
    const user = await Truck.findOne(id);
    if (!user) throw new HttpException('User Not Found', HttpStatus.NOT_FOUND);
    user.numberPlate = updateUserDto.numberPlate;
    user.description = updateUserDto.description;
    user.fuelCapacity = updateUserDto.fuelCapacity;
    return await user.save();
  }

  async remove(id: number) {
    const truck = await Truck.findOne(id);
    if (!truck)
      throw new HttpException('Truck Not Found', HttpStatus.NOT_FOUND);
    const result = truck.softRemove();
    console.log(result);
    return result;
  }
}
