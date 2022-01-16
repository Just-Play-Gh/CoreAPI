import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import {
  IPaginationOptions,
  paginate,
  Pagination,
} from 'nestjs-typeorm-paginate';
import { createQueryBuilder } from 'typeorm';
import { CreateGeofenceDto } from './dto/create-geofence.dto';
import { UpdateGeofenceDto } from './dto/update-geofence.dto';
import { Geofence } from './entities/geofence.entity';

@Injectable()
export class GeofenceService {
  async create(createGeofenceDto: CreateGeofenceDto) {
    try {
      const geofence = await Geofence.create(createGeofenceDto);
      return await Geofence.save(geofence);
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

  async findAll(
    options: IPaginationOptions,
    filter = {},
  ): Promise<Pagination<Geofence>> {
    const geofenceRepository = createQueryBuilder(Geofence)
      .where(filter)
      .orderBy({ created: 'DESC' });

    const geofences = await paginate<Geofence>(geofenceRepository, options);
    return geofences;
  }

  async findOne(id: number) {
    const geofence = await Geofence.findOne({ id: id });
    if (!geofence)
      throw new HttpException('Geofence not found', HttpStatus.NOT_FOUND);
    return geofence;
  }

  async update(id: number, updateGeofenceDto: UpdateGeofenceDto) {
    const geofence = await Geofence.findOne(id);
    if (!geofence)
      throw new HttpException('Geofence not found', HttpStatus.NOT_FOUND);
    geofence.focusPoint = updateGeofenceDto.focusPoint;
    geofence.name = updateGeofenceDto.name;
    geofence.description = updateGeofenceDto.description;
    geofence.radius = updateGeofenceDto.radius;
    geofence.status = geofence.status ?? updateGeofenceDto.status;
    return await geofence.save();
  }

  async remove(id: number) {
    const geofence = await Geofence.findOne(id);
    if (!geofence)
      throw new HttpException('Geofence not found', HttpStatus.NOT_FOUND);
    const result = await geofence.softRemove();
    console.log(result);
    return result;
  }
}
