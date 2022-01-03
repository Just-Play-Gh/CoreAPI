import { IPaginationOptions, Pagination } from 'nestjs-typeorm-paginate';
import { BaseService } from 'src/resources/base.service';
import { CreateDeviceDto } from './dto/create-device.dto';
import { Device } from './entities/device.entity';
export declare class DeviceService extends BaseService {
    constructor();
    store(createDeviceDto: CreateDeviceDto, customer: any): Promise<Device>;
    getDevices(options: IPaginationOptions, filter?: {}): Promise<Pagination<Device>>;
}
