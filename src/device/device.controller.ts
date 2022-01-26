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
import { CurrentUser } from 'src/decorators/current-user.decorator';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { PermissionGuard } from 'src/guards/permission-guard';
import { GetOrderDto } from 'src/order/dto/get-order.dto';
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

  @UseGuards(JwtAuthGuard, PermissionGuard)
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
  @UseGuards(JwtAuthGuard, PermissionGuard)
  @Post('/bulk')
  async storeBulk(
    @CurrentUser() customer,
    @Body() createDeviceDto: CreateDeviceDto[],
  ) {
    return this.deviceService.store(createDeviceDto, customer);
  }
  @UseGuards(JwtAuthGuard, PermissionGuard)
  @Get()
  async getDevicesForCustomer(
    @CurrentUser() customer,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page = 1,
    @Query('limit', new DefaultValuePipe(15), ParseIntPipe) limit = 15,
    @Query() getDevice: GetOrderDto,
  ) {
    Logger.log('getting devices for customer', getDevice);
    delete getDevice.page;
    delete getDevice.limit;
    return this.deviceService.getDevices(
      { page, limit },
      { customerId: customer.id },
    );
  }
}
