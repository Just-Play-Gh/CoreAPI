import { DriverService } from './driver.service';
import { GetDriverLocationDto } from './dto/get-driver-location.dto';
import { UpdateDriverLocationDto } from './dto/update-driver-location.dto';
export declare class DriverController {
    private readonly driverService;
    constructor(driverService: DriverService);
    pingCurrentLocation(driver: any, driverLocationDto: UpdateDriverLocationDto): Promise<{
        driverId: number;
        coordinates: string;
        updatedAt: import("dayjs").Dayjs;
    }>;
    getCurrentLocation(getDriverLocationDto: GetDriverLocationDto): Promise<unknown>;
}
