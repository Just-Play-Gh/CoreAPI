import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { CurrentUser } from 'src/decorators/current-user.decorator';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { DriverService } from './driver.service';
import { GetDriverLocationDto } from './dto/get-driver-location.dto';
import { UpdateDriverLocationDto } from './dto/update-driver-location.dto';

@Controller('driver')
export class DriverController {
  constructor(private readonly driverService: DriverService) {}

  @Post('location')
  async pingCurrentLocation(
    @CurrentUser() driver,
    @Body() driverLocationDto: UpdateDriverLocationDto,
  ) {
    console.log('I was called by you', driverLocationDto);
    const coordinates = await this.driverService.updateCurrentLocation(
      driver,
      driverLocationDto,
    );
    return coordinates;
  }
  @Get('location')
  async getCurrentLocation(
    @Query() getDriverLocationDto: GetDriverLocationDto,
  ) {
    const coordinates = await this.driverService.getCurrentLocation(
      getDriverLocationDto,
    );
    return coordinates;
  }
}
