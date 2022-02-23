import {
  Body,
  Controller,
  DefaultValuePipe,
  Get,
  Logger,
  ParseIntPipe,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { Customer } from 'src/customer/entities/customer.entity';
import { CurrentUser } from 'src/decorators/current-user.decorator';
import { Permissions } from 'src/decorators/permissions.decorator';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { PermissionGuard } from 'src/guards/permission-guard';
import { BaseController } from 'src/resources/base.controller';
import { DeviceService } from './device.service';
import { CreateDeviceDto } from './dto/create-device.dto';
import { UpdateDeviceDto } from './dto/update-device.dto';

@Controller('devices')
export class DeviceController extends BaseController {
  constructor(private readonly deviceService: DeviceService) {
    super(deviceService);
    this.dtos = { store: CreateDeviceDto, update: UpdateDeviceDto };
  }

  // @UseGuards(JwtAuthGuard, PermissionGuard)
  @UseGuards(JwtAuthGuard)
  @Post()
  async store(
    @CurrentUser() customer,
    @Body() createDeviceDto: CreateDeviceDto,
  ) {
    const response = await this.deviceService.store(
      [createDeviceDto],
      customer,
    );
    return response[0];
  }

  @UseGuards(JwtAuthGuard)
  // @UseGuards(JwtAuthGuard, PermissionGuard)
  @Post('/bulk')
  async storeBulk(
    @CurrentUser() customer,
    @Body() createDeviceDto: CreateDeviceDto[],
  ) {
    return this.deviceService.store(createDeviceDto, customer);
  }

  @UseGuards(JwtAuthGuard, PermissionGuard)
  @Permissions('get-myDevices')
  @Get('/customer')
  async myDevices(
    @CurrentUser() customer: Customer,
    @Query() query: { page: number; limit: number },
  ) {
    console.log('the customer', customer);
    return this.deviceService.myDevices(customer, query);
  }
}
