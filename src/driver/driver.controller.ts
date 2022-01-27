import {
  Body,
  Controller,
  Get,
  Logger,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CurrentUser } from 'src/decorators/current-user.decorator';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { PermissionGuard } from 'src/guards/permission-guard';
import { BaseController } from 'src/resources/base.controller';
import { DriverService } from './driver.service';
import { CreateDriverDto } from './dto/create-driver.dto';
import { GetDriverLocationDto } from './dto/get-driver-location.dto';
import { UpdateDriverLocationDto } from './dto/update-driver-location.dto';
import { Driver } from './entities/driver.entity';

@Controller('drivers')
export class DriverController extends BaseController {
  constructor(private readonly driverService: DriverService) {
    super(driverService);
  }

  @Post('location')
  @UseGuards(JwtAuthGuard, PermissionGuard)
  async pingCurrentLocation(
    @CurrentUser() driver,
    @Body() driverLocationDto: UpdateDriverLocationDto,
  ) {
    Logger.log('Driver sending their location', driverLocationDto);
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
    Logger.log('getting driver location', coordinates);

    return coordinates;
  }

  @Patch('/update-profile')
  @UseGuards(JwtAuthGuard, PermissionGuard)
  async oauthLogin(@Body() updateProfileDto, @CurrentUser() user: Driver) {
    Logger.log(`updating driver's profile`);
    return this.driverService.updateProfileDto(updateProfileDto, user);
  }

  @Get('/closest')
  @UseGuards(JwtAuthGuard, PermissionGuard)
  async getClosestDriver(@CurrentUser() user: Driver) {
    const customerLatLong = '5.765453300607118, -0.17460084872039427';
    // Logger.log(`getting driver's profile`);
    return this.driverService.getClosestDriver(customerLatLong);
  }

  @UseGuards(JwtAuthGuard, PermissionGuard)
  @Post()
  async store(
    @Body() body: CreateDriverDto,
    @CurrentUser() user: Driver,
  ): Promise<Driver> {
    return await this.driverService.storeDriver(body, user);
  }

  @Get('/search')
  @UseGuards(JwtAuthGuard, PermissionGuard)
  async searchCustomer(@Query() params) {
    return await this.driverService.search(params);
  }
}
