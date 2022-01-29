import { Body, Controller, Logger, Param, Patch, Post } from '@nestjs/common';
import { CreateMobileDeviceDto } from './dto/create.dto';
import { UpdateMobileDeviceDto } from './dto/update.dto';
import { MobileDeviceService } from './mobile-devices.service';

@Controller('mobile-devices')
export class MobileDeviceController {
  constructor(private readonly mobileDeviceService: MobileDeviceService) {}

  @Post()
  async store(@Body() createMobileDevice: CreateMobileDeviceDto) {
    Logger.log('Creating Mobile Device', createMobileDevice);
    return await this.mobileDeviceService.store(createMobileDevice);
  }

  @Patch(':id')
  async update(
    @Param() id: string,
    @Body() updateMobileDevice: UpdateMobileDeviceDto,
  ) {
    Logger.log('Update mobile device dto', updateMobileDevice);

    return await this.mobileDeviceService.update(id, updateMobileDevice);
  }
}
