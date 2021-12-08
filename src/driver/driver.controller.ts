import { Controller, Patch } from '@nestjs/common';
import { BaseController } from 'src/resources/base.controller';
import { DriverService } from './driver.service';

@Controller('driver')
export class DriverController {
  constructor(private readonly driverService: DriverService) {}
}
