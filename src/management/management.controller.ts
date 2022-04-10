import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpException,
  HttpStatus,
  Query,
  DefaultValuePipe,
  ParseIntPipe,
  Logger,
} from '@nestjs/common';
import { ManagementService } from './management.service';
import { CreateManagementDto } from './dto/create-management.dto';
import { UpdateManagementDto } from './dto/update-management.dto';
import { DeviceService } from 'src/device/device.service';
import { Customer } from 'src/customer/entities/customer.entity';

@Controller('management')
export class ManagementController {
  constructor(
    private readonly managementService: ManagementService,
    private readonly deviceService: DeviceService,
  ) {}

  @Post('devices/customer')
  create(@Body() createManagementDto: CreateManagementDto) {
    return this.managementService.create(createManagementDto);
  }

  @Get('customer/:id/devices')
  async getCustomerDevices(
    @Param('id') id: number,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page = 1,
    @Query('limit', new DefaultValuePipe(15), ParseIntPipe) limit = 50,
  ) {
    Logger.log(
      `ManagementController.getCustomerDevices()`,
      'ManagementController',
    );
    const customer = await Customer.findOne(id);
    if (customer) {
      return this.deviceService.myDevices(customer, {
        page: page,
        limit: limit,
      });
    }
    Logger.log(`Customer with id ${id} not found`);
    throw new HttpException('Customer not found', HttpStatus.NOT_FOUND);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.managementService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateManagementDto: UpdateManagementDto,
  ) {
    return this.managementService.update(+id, updateManagementDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.managementService.remove(+id);
  }
}
