import { InjectRedis, Redis } from '@nestjs-modules/ioredis';
import {
  CACHE_MANAGER,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import { Cache } from 'cache-manager';
import dayjs from 'dayjs';
import { createQueryBuilder, getRepository } from 'typeorm';
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
import {
  IPaginationOptions,
  paginate,
  Pagination,
} from 'nestjs-typeorm-paginate';

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
  async remove(id: number | string) {
    const driver = await Driver.findOne({ where: { id: id } });
    if (!driver) {
      console.log('Driver not found for deletion');
      throw new HttpException('Driver not found', HttpStatus.NOT_FOUND);
    }
    try {
      const result = await driver.softRemove();
      return result;
    } catch (error) {
      console.log(error);
      throw new HttpException(
        'An error occured',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  async paginate(
    options: IPaginationOptions,
    searchParams = {},
  ): Promise<Pagination<Driver>> {
    let driverRepository;
    if (searchParams) {
      driverRepository = createQueryBuilder(Driver).where(searchParams);
      // .withDeleted();
    } else {
      driverRepository = createQueryBuilder(Driver).withDeleted();
    }
    const drivers = await paginate<Driver>(driverRepository, options);
    if (!drivers['items'])
      throw new HttpException('No drivers were found', HttpStatus.NOT_FOUND);
    return drivers;
  }
  async storeDriver(body: CreateDriverDto): Promise<Driver> {
    const password = generatePassword(8);
    try {
      const driver = await Driver.create(body);
      driver.password = password;
      driver.deleted = null;
      const createdDriver = await Driver.save(driver);
      this.notificationService.sendWelcomeEmail(driver, password, 'driver');
      return createdDriver;
    } catch (error: any) {
      if (error.code === 'ER_DUP_ENTRY') {
        console.log('Record already exists', error.message, error);
        throw new HttpException(
          'Record already exists',
          HttpStatus.UNPROCESSABLE_ENTITY,
        );
      }
      console.log('An error occured', error);
      throw new HttpException('Sorry an error occured', HttpStatus.BAD_REQUEST);
    }
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
      driverCoordinates = await this.filter(
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
      console.log(driverCoordinates);
      if (!Object.keys(driverCoordinates).length) {
        Logger.log('No drivers found');
        return false;
      }
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
  filter(obj, callback) {
    return Object.fromEntries(
      Object.entries(obj).filter(([key, val]) => callback(val, key)),
    );
  }

  sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
