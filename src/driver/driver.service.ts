import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';
import dayjs from 'dayjs';
import { GetDriverLocationDto } from './dto/get-driver-location.dto';
import { UpdateDriverLocationDto } from './dto/update-driver-location.dto';
import { Driver } from './entities/driver.entity';

@Injectable()
export class DriverService {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}
  async updateCurrentLocation(
    driver: Driver,
    driverLocationDto: UpdateDriverLocationDto,
  ) {
    const ttl = { ttl: +process.env.DRIVER_LOCATION_CACHE_TTL || 60 };
    const res = await this.cacheManager.set(
      driver.id.toString(),
      {
        driverId: driver.id,
        coordinates: driverLocationDto.coordinates,
        updatedAt: dayjs(),
      },
      ttl,
    );
    return res;
  }

  async getCurrentLocation(driver: GetDriverLocationDto) {
    const coordinates = await this.cacheManager.get(driver.driverId.toString());
    console.log(coordinates);
    return coordinates;
  }
}
