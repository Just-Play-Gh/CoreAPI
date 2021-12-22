import { Injectable } from '@nestjs/common';
import { BaseService } from 'src/resources/base.service';
import { Device } from './entities/device.entity';

@Injectable()
export class DeviceService extends BaseService {
  constructor() {
    super(Device);
  }
}
