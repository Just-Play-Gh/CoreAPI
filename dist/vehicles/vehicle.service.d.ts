import { HttpService } from '@nestjs/axios';
import { BaseService } from 'src/resources/base.service';
import { SearchDto } from './dto/search.dto';
import { VehicleMake } from './entities/make.entity';
export declare class VehicleService extends BaseService {
    private readonly httpService;
    constructor(httpService: HttpService);
    getAllMake(): Promise<VehicleMake[]>;
    searchMake(searchDto: SearchDto): Promise<VehicleMake[]>;
    insertModel(): Promise<string>;
    sleep(ms: any): Promise<unknown>;
}
