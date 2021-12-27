import { VehicleService } from './vehicle.service';
import { SearchDto } from './dto/search.dto';
export declare class VehicleController {
    private readonly vehicleService;
    constructor(vehicleService: VehicleService);
    getAll(): Promise<import("./entities/make.entity").AllMakes[]>;
    searchMake(searchDto: SearchDto): Promise<import("./entities/make.entity").AllMakes[]>;
    storeModels(): Promise<string>;
}
