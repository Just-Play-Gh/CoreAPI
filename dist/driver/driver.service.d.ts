import { Cache } from 'cache-manager';
import dayjs from 'dayjs';
import { GetDriverLocationDto } from './dto/get-driver-location.dto';
import { UpdateDriverLocationDto } from './dto/update-driver-location.dto';
import { Driver } from './entities/driver.entity';
export declare class DriverService {
    private cacheManager;
    constructor(cacheManager: Cache);
    updateCurrentLocation(driver: Driver, driverLocationDto: UpdateDriverLocationDto): Promise<{
        driverId: number;
        coordinates: string;
        updatedAt: dayjs.Dayjs;
    }>;
    getCurrentLocation(driver: GetDriverLocationDto): Promise<unknown>;
    updateProfileDto(updateProfileDto: any, user: Driver): Promise<Driver>;
}
