import { Controller } from '@nestjs/common';
import { BaseController } from 'src/resources/base.controller';
import { DeviceService } from './device.service';
import { CreateDeviceDto } from './dto/create-device.dto';
import { UpdateDeviceDto } from './dto/update-device.dto';

@Controller('device')
export class DeviceController extends BaseController {
  constructor(private readonly deviceService: DeviceService) {
    super(deviceService);
    this.dtos = { store: CreateDeviceDto, update: UpdateDeviceDto };
  }
}
