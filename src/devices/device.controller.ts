import { Controller, Get, Post, Query } from '@nestjs/common';
import { DeviceService } from './device.service';
import { SearchDto } from './dto/search.dto';

@Controller('devices')
export class DeviceController {
  constructor(private readonly deviceService: DeviceService) {}
  @Get()
  async getAll() {
    return await this.deviceService.getAllMake();
  }

  @Get('/make/search')
  async searchMake(@Query() searchDto: SearchDto) {
    return this.deviceService.searchMake(searchDto);
  }

  @Post('/models')
  async storeModels() {
    return await this.deviceService.insertModel();
  }
}
