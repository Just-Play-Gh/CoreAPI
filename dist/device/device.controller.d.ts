import { GetOrderDto } from 'src/order/dto/get-order.dto';
import { BaseController } from 'src/resources/base.controller';
import { DeviceService } from './device.service';
export declare class DeviceController extends BaseController {
    private readonly deviceService;
    constructor(deviceService: DeviceService);
    getDevicesForCustomer(customer: any, page: number, limit: number, getDevice: GetOrderDto): Promise<import("nestjs-typeorm-paginate").Pagination<import("./entities/device.entity").Device, import("nestjs-typeorm-paginate").IPaginationMeta>>;
}
