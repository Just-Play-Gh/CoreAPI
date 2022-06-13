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
  UseGuards,
} from '@nestjs/common';
import { ManagementService } from './management.service';
import { CreateManagementDto } from './dto/create-management.dto';
import { UpdateManagementDto } from './dto/update-management.dto';
import { DeviceService } from 'src/device/device.service';
import { Customer } from 'src/customer/entities/customer.entity';
import { OrderService } from 'src/order/order.service';
import { CurrentUser } from 'src/decorators/current-user.decorator';
import { GetOrderDto } from 'src/order/dto/get-order.dto';
import { Role } from 'src/role/entity/role.entity';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { Order } from 'src/order/entities/order.entity';
import { CreateOrderDto } from 'src/order/dto/create-order.dto';
import { UpdateOrderDto } from 'src/order/dto/update-order.dto';

@Controller('management')
export class ManagementController {
  constructor(
    private readonly managementService: ManagementService,
    private readonly deviceService: DeviceService,
    private readonly orderService: OrderService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Get('orders')
  async getOrders(
    // @CurrentUser() admin,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page = 1,
    @Query('limit', new DefaultValuePipe(15), ParseIntPipe) limit = 15,
    @Query() getOrders: GetOrderDto,
  ) {
    delete getOrders.page;
    delete getOrders.limit;
    // const role: Role = JSON.parse(admin.role);
    // if (role.alias === 'customer') {
    //   throw new HttpException(
    //     'You are not authorised to perform this action',
    //     HttpStatus.UNAUTHORIZED,
    //   );
    // }
    return this.orderService.getOrders({ page, limit }, getOrders);
  }

  @UseGuards(JwtAuthGuard)
  @Post('orders/create-for-customer')
  async createOrderForCustomer(
    @CurrentUser() admin,
    @Body() createOrderDto: CreateOrderDto,
  ): Promise<Order> {
    Logger.log('Creating an order for customer', {
      request: createOrderDto,
    });
    const role: Role = JSON.parse(admin.role);
    if (role.alias !== 'admin') {
      throw new HttpException(
        'You are not authorised to perform this action',
        HttpStatus.UNAUTHORIZED,
      );
    }
    Logger.log('Creating an order', {
      request: createOrderDto,
    });
    if (
      !(await this.orderService.checkIfLatlongIsInAGeofence(
        createOrderDto.latlong,
      ))
    ) {
      Logger.log('Currently not available in your location', {
        request: createOrderDto,
      });
      throw new HttpException(
        'Sorry, we are currently not available in your location',
        HttpStatus.SERVICE_UNAVAILABLE,
      );
    }
    const customer = await Customer.findOne(createOrderDto.customerId);
    if (customer) {
      createOrderDto.customerFullName =
        customer.firstName + ' ' + customer.lastName;
    }
    return this.orderService.store(createOrderDto);
  }
  @UseGuards(JwtAuthGuard)
  @Patch('orders/:orderId')
  async updateOrder(
    @CurrentUser() admin,
    @Param() orderId: string,
    @Body() updateOrderDto: UpdateOrderDto,
  ): Promise<Order> {
    const role: Role = JSON.parse(admin.role);
    if (role.alias !== 'admin') {
      throw new HttpException(
        'You are not authorised to perform this action',
        HttpStatus.UNAUTHORIZED,
      );
    }
    Logger.log('Updating an order', {
      request: updateOrderDto,
    });

    return this.orderService.updateOrder(orderId, updateOrderDto);
  }
  @Post('devices/customer')
  create(@Body() createManagementDto: CreateManagementDto) {
    return this.managementService.create(createManagementDto);
  }

  @UseGuards(JwtAuthGuard)
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

  // @UseGuards(JwtAuthGuard)
  // @Get('drivers')
  // async getDrivers(
  //   @Query('page', new DefaultValuePipe(1), ParseIntPipe) page = 1,
  //   @Query('limit', new DefaultValuePipe(15), ParseIntPipe) limit = 50,
  // ) {
  //   Logger.log('ManagementController.getDrivers()', 'ManagementController');
  //   console.log('here');
  //   return this.driverService.findAlld({
  //     page,
  //     limit,
  //   });
  // }

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
