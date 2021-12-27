import {
  Body,
  Controller,
  Get,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CurrentUser } from 'src/decorators/current-user.decorator';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { DriverService } from './driver.service';
import { GetDriverLocationDto } from './dto/get-driver-location.dto';
import { UpdateDriverLocationDto } from './dto/update-driver-location.dto';
import { Driver } from './entities/driver.entity';

@Controller('drivers')
export class DriverController {
  constructor(private readonly driverService: DriverService) {}

  @Post('location')
  async pingCurrentLocation(
    @CurrentUser() driver,
    @Body() driverLocationDto: UpdateDriverLocationDto,
  ) {
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

  @Patch('/update-profile')
  @UseGuards(JwtAuthGuard)
  async oauthLogin(@Body() updateProfileDto, @CurrentUser() user: Driver) {
    return this.driverService.updateProfileDto(updateProfileDto, user);
  }
}
