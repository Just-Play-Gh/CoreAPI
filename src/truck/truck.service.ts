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

  async findOne(id: number) {
    const truck = await Truck.findOne({ id: id });
    if (!truck)
      throw new HttpException('Truck not found', HttpStatus.NOT_FOUND);
    return truck;
  }

  async update(id: number, updateTruck: UpdateTruckDto) {
    const truck = await Truck.findOne(id);
    if (!truck)
      throw new HttpException('Truck not found', HttpStatus.NOT_FOUND);
    truck.numberPlate = updateTruck.numberPlate;
    truck.name = updateTruck.name;
    truck.description = updateTruck.description;
    truck.fuelCapacity = updateTruck.fuelCapacity;
    return await truck.save();
  }

  async remove(id: number) {
    const truck = await Truck.findOne(id);
    if (!truck)
      throw new HttpException('Truck not found', HttpStatus.NOT_FOUND);
    const result = truck.softRemove();
    console.log(result);
    return result;
  }

  async assignDriverToTruck(
    id: number,
    updateTruckDto: UpdateTruckDto,
  ): Promise<Truck> {
    const { driverId } = updateTruckDto;
    const truck = await Truck.findOne(id);
    if (!truck)
      throw new HttpException('Truck not found', HttpStatus.NOT_FOUND);

    truck.driverId = driverId;
    const assignedTruck = await Truck.save(truck);
    return assignedTruck;
  }
}
