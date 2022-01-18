import { InjectRedis, Redis } from '@nestjs-modules/ioredis';
import { CACHE_MANAGER, Inject, Injectable, Logger } from '@nestjs/common';
import { Cache } from 'cache-manager';
import dayjs from 'dayjs';
import { getRepository, Like } from 'typeorm';
import { GetDriverLocationDto } from './dto/get-driver-location.dto';
import { UpdateDriverLocationDto } from './dto/update-driver-location.dto';
import { Driver } from './entities/driver.entity';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom, map } from 'rxjs';
import { BaseService } from 'src/resources/base.service';
import { CreateDriverDto } from './dto/create-driver.dto';
import { generatePassword } from 'src/helpers/generator';
import { NotificationService } from 'src/notification/notification.service';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class DriverService extends BaseService {
  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    @InjectRedis() private readonly redis: Redis,
    private readonly httpService: HttpService,
    private readonly notificationService: NotificationService,
    private eventEmitter: EventEmitter2,
  ) {
    super(Driver);
  }

  async storeDriver(body: CreateDriverDto): Promise<Driver> {
    const password = generatePassword(8);
    const driver = await this.store({ ...body, password }, {}, null);
    await this.notificationService.sendWelcomeEmail(driver, password, 'driver');
    return driver;
  }

  async updateCurrentLocation(
    driver: Driver,
    driverLocationDto: UpdateDriverLocationDto,
  ) {
    const ttl = { ttl: +process.env.DRIVER_LOCATION_CACHE_TTL || 60 };
    console.log(driver.id);
    const data = JSON.stringify({
      driverId: driver.id,
      coordinates: driverLocationDto.coordinates,
      updatedAt: dayjs(),
    });
    this.redis.hset('driver-locations', driver.id, data);
    return data;
  }
  // async search(param) {
  //   try {
  //     Logger.log('searching driver...', param);
  //     const driver = await Driver.find({
  //       where: [
  //         { email: Like(`%${param.searchKey}%`) },
  //         { phoneNumber: Like(`%${param.searchKey}%`) },
  //       ],
  //     });
  //     return driver;
  //   } catch (error) {
  //     Logger.log('error searching for driver', error);
  //     throw error;
  //   }
  // }

  async getCurrentLocation(driver: GetDriverLocationDto) {
    const coordinates = await this.redis.hget(
      'driver-locations',
      driver.driverId,
    );
    console.log(coordinates);
    return coordinates;
  }

  async updateProfileDto(updateProfileDto, user: Driver) {
    const driver = await getRepository(Driver).findOne({
      where: { id: user.id },
    });
    console.log('setting you', updateProfileDto, driver, user.id);
    for (const key in updateProfileDto) {
      driver[key] = updateProfileDto[key];
    }
    console.log('set', driver, updateProfileDto);
    return await driver.save();
  }

  async getClosestDriver(customerLatLong) {
    const drivers = await this.redis.hgetall('driver-locations');
    if (!drivers) {
      Logger.log('No drivers nearby', {});
      return false;
    }
    let driverCoordinates = await this.map(drivers, (driver) => {
      const newDriver = JSON.parse(driver);
      return newDriver;
    });

    let destinations = '';
    for (const coordinate in driverCoordinates) {
      if (destinations.length < 1) {
        destinations = destinations.concat(
          `${driverCoordinates[coordinate].coordinates}`,
        );
      } else {
        destinations = destinations.concat(
          `|${driverCoordinates[coordinate].coordinates}`,
        );
      }
    }
    const url = new URL(process.env.GOOGLE_MAPS_URL + '/distancematrix/json');
    url.searchParams.set('key', process.env.GOOGLE_MAPS_CLIENT_KEY);
    url.searchParams.set('destinations', destinations);
    url.searchParams.set('origins', customerLatLong);
    const response = await lastValueFrom(
      this.httpService.get(url.toString()).pipe(map((res) => res.data)),
    );
    console.log(response);
    if (response && response.status === 'OK') {
      const coordinatesFromGoogle = await response.rows[0].elements;
      let count = 0;
      const sortedDrivers = {};
      const distancesInMeters = [];
      driverCoordinates = await this.map(
        driverCoordinates,
        (driverCoordinate) => {
          try {
            console.log(coordinatesFromGoogle);
            const distance = coordinatesFromGoogle[count].distance;
            console.log(distance);
            const distanceValue = coordinatesFromGoogle[count].distance.value;
            const duration = coordinatesFromGoogle[count].duration;
            driverCoordinate.distance = distance;
            driverCoordinate.duration = duration;
            count++;
            sortedDrivers[distanceValue] = driverCoordinate.driverId;
            distancesInMeters.push(distance.value);
            return driverCoordinate;
          } catch (error) {
            console.log(error);
          }
        },
      );
      // Filter by closest driver(minutes)
      const sortedDistance = [...new Set(distancesInMeters)].sort(
        (a, b) => a - b,
      );
      return {
        sortedDistance,
        sortedDrivers,
      };
    }
  }

  map(obj, callback) {
    const result = {};
    Object.keys(obj).forEach(function (key) {
      result[key] = callback.call(obj, obj[key], key, obj);
    });
    return result;
  }

  sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
