import { HttpService } from '@nestjs/axios';
import { SearchDto } from './dto/search.dto';
import { AllMakes } from './entities/make.entity';
export declare class VehicleService {
    private readonly httpService;
    constructor(httpService: HttpService);
    getAllMake(): Promise<AllMakes[]>;
    searchMake(searchDto: SearchDto): Promise<AllMakes[]>;
    insertModel(): Promise<string>;
    sleep(ms: any): Promise<unknown>;
}
