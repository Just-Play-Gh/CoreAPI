import {
  Controller,
  DefaultValuePipe,
  Get,
  Logger,
  ParseIntPipe,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CurrentUser } from 'src/decorators/current-user.decorator';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
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

  @UseGuards(JwtAuthGuard)
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
