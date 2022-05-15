import { InjectRedis, Redis } from '@nestjs-modules/ioredis';
import {
  Body,
  Controller,
  DefaultValuePipe,
  Get,
  HttpException,
  HttpStatus,
  Logger,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CurrentUser } from 'src/decorators/current-user.decorator';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { BaseController } from 'src/resources/base.controller';
import { CreateOrderDto } from './dto/create-order.dto';
import { GetOrderDto } from './dto/get-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { OrderLog } from './entities/order-logs.entity';
import { Order } from './entities/order.entity';
import { OrderService } from './order.service';
import { Role } from 'src/role/entity/role.entity';
import { PermissionGuard } from 'src/guards/permission-guard';
import { Permissions } from 'src/decorators/permissions.decorator';
import { Customer } from 'src/customer/entities/customer.entity';

@Controller('orders')
export class OrderController extends BaseController {
  constructor(
    private readonly orderService: OrderService,
    @InjectRedis() private readonly redis: Redis,
  ) {
    super(orderService);
    this.dtos = { store: CreateOrderDto, update: UpdateOrderDto };
  }

  @UseGuards(JwtAuthGuard)
  // @Permissions(['create-order'])
  @Post()
  async store(
    @CurrentUser() customer,
    @Body() createOrderDto: CreateOrderDto,
  ): Promise<Order> {
    // const role: Role = JSON.parse(customer.role);
    // if (role.alias !== 'customer') {
    //   throw new HttpException(
    //     'You are not authorised to perform this action',
    //     HttpStatus.UNAUTHORIZED,
    //   );
    // }
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
    createOrderDto.customerId = customer.id;
    createOrderDto.customerFullName =
      customer.firstName + ' ' + customer.lastName;
    return this.orderService.store(createOrderDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/customer')
  async getOrders(
    @CurrentUser() customer,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page = 1,
    @Query('limit', new DefaultValuePipe(15), ParseIntPipe) limit = 15,
    @Query() getOrders: GetOrderDto,
  ) {
    delete getOrders.page;
    delete getOrders.limit;
    // const role: Role = JSON.parse(customer.role);
    // if (role.alias !== 'customer') {
    //   throw new HttpException(
    //     'You are not authorised to perform this action',
    //     HttpStatus.UNAUTHORIZED,
    //   );
    // }
    return this.orderService.getOrders(
      { page, limit },
      { customerId: customer.id },
    );
  }

  @UseGuards(JwtAuthGuard)
  @Get('/customer/:id')
  async getCustomerOrders(
    @CurrentUser() admin,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page = 1,
    @Query('limit', new DefaultValuePipe(15), ParseIntPipe) limit = 50,
    @Query() getOrders: GetOrderDto,
    @Param() id: string, // Create new dto and make it required
  ) {
    delete getOrders.page;
    delete getOrders.limit;
    // const role: Role = JSON.parse(customer.role);
    // if (role.alias !== 'customer') {
    //   throw new HttpException(
    //     'You are not authorised to perform this action',
    //     HttpStatus.UNAUTHORIZED,
    //   );
    // }
    return this.orderService.getOrders({ page, limit }, { customerId: id });
  }

  @UseGuards(JwtAuthGuard)
  @Get('/driver')
  async getOrdersForDriver(
    @CurrentUser() driver,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page = 1,
    @Query('limit', new DefaultValuePipe(15), ParseIntPipe) limit = 15,
    @Query() getOrders: GetOrderDto,
  ) {
    delete getOrders.page;
    delete getOrders.limit;
    // const role: Role = JSON.parse(driver.role);
    // if (role.alias !== 'driver') {
    //   throw new HttpException(
    //     'You are not authorised to perform this action',
    //     HttpStatus.UNAUTHORIZED,
    //   );
    // }
    return this.orderService.getOrders(
      { page, limit },
      { driverId: driver.id },
    );
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/accept')
  async accept(@CurrentUser() driver, @Param() id: string): Promise<Order> {
    const role: Role = JSON.parse(driver.role);
    if (role.alias !== 'driver') {
      Logger.log('Sorry, only drivers can accept orders', { driver });
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    }
    return this.orderService.acceptOrder(driver, id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id/cancel')
  async cancelOrder(
    @CurrentUser() authuser,
    @Param() orderId: string,
  ): Promise<Order> {
    const order = await Order.findOne(orderId);
    if (!order) {
      throw new HttpException('Order not found', HttpStatus.BAD_REQUEST);
    }
    return this.orderService.cancelOrder(order);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/complete')
  async completeOrder(
    @CurrentUser() authuser,
    @Param() orderId: string,
  ): Promise<Order> {
    const order = await Order.findOne(orderId);
    if (!order) {
      throw new HttpException('Order not found', HttpStatus.BAD_REQUEST);
    }
    return this.orderService.completeOrder(order);
  }

  @Get(':id/logs')
  async getOrderLogs(@Param() orderId: { id: string }): Promise<OrderLog[]> {
    return await this.orderService.getOrderLogs(orderId);
  }
}
