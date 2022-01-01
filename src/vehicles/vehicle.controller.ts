import { Controller, Get, Post, Query } from '@nestjs/common';
import { VehicleService } from './vehicle.service';
import { SearchDto } from './dto/search.dto';
import { BaseController } from 'src/resources/base.controller';

@Controller('vehicles')
export class VehicleController extends BaseController {
  constructor(private readonly vehicleService: VehicleService) {
    super(vehicleService);
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
