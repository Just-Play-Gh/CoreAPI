import { Controller, Get, Post, Query } from '@nestjs/common';
import { VehicleService } from './vehicle.service';
import { SearchDto } from './dto/search.dto';

@Controller('vehicles')
export class VehicleController {
  constructor(private readonly vehicleService: VehicleService) {}
  @Get()
  async getAll() {
    return await this.vehicleService.getAllMake();
  }

  @Get('/make/search')
  async searchMake(@Query() searchDto: SearchDto) {
    return this.vehicleService.searchMake(searchDto);
  }

  @Post('/models')
  async storeModels() {
    return await this.vehicleService.insertModel();
  }
}
