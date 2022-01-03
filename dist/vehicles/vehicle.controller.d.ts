import { VehicleService } from './vehicle.service';
import { SearchDto } from './dto/search.dto';
import { BaseController } from 'src/resources/base.controller';
export declare class VehicleController extends BaseController {
    private readonly vehicleService;
    constructor(vehicleService: VehicleService);
    searchMake(searchDto: SearchDto): Promise<import("./entities/make.entity").VehicleMake[]>;
    storeModels(): Promise<string>;
}
