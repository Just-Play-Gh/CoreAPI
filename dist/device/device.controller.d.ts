import { BaseController } from 'src/resources/base.controller';
import { DeviceService } from './device.service';
export declare class DeviceController extends BaseController {
    private readonly deviceService;
    constructor(deviceService: DeviceService);
}
