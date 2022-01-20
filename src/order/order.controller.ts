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
import {
  Geofence,
  GeofenceStatus,
} from 'src/geofence/entities/geofence.entity';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { BaseController } from 'src/resources/base.controller';
import { CreateOrderDto } from './dto/create-order.dto';
import { GetOrderDto } from './dto/get-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { OrderLog } from './entities/order-logs.entity';
import { Order } from './entities/order.entity';
import { OrderService } from './order.service';

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
  @Post()
  async store(
    @CurrentUser() customer,
    @Body() createOrderDto: CreateOrderDto,
  ): Promise<Order> {
    if (customer.role !== 'customer') {
      throw new HttpException(
        'You are not authorised to perform this action',
        HttpStatus.UNAUTHORIZED,
      );
    }
    // await this.checkIfCustomerIsWithinRange(createOrderDto.latlong);
    createOrderDto.customerId = customer.id;
    createOrderDto.customerFullName =
      customer.firstName + ' ' + customer.lastName;
    return this.orderService.store(createOrderDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/customer')
  async getOrdersForCustomer(
    @CurrentUser() customer,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page = 1,
    @Query('limit', new DefaultValuePipe(15), ParseIntPipe) limit = 15,
    @Query() getOrders: GetOrderDto,
  ) {
    delete getOrders.page;
    delete getOrders.limit;
    if (customer.role !== 'customer') {
      throw new HttpException(
        'You are not authorised to perform this action',
        HttpStatus.UNAUTHORIZED,
      );
    }
    return this.orderService.getOrders(
      { page, limit },
      { customerId: customer.id },
    );
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
    if (driver.role !== 'driver') {
      throw new HttpException(
        'You are not authorised to perform this action',
        HttpStatus.UNAUTHORIZED,
      );
    }
    return this.orderService.getOrders(
      { page, limit },
      { driverId: driver.id },
    );
  }

  // Should have permission to accept or role
  @UseGuards(JwtAuthGuard)
  @Get(':id/accept')
  async accept(@CurrentUser() driver, @Param() id: string): Promise<Order> {
    if (driver.role !== 'driver') {
      Logger.log('Forbidden! You must be a driver to accept orders.');
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
    if (
      (authuser.role === 'customer' && order.customerId === authuser.id) ||
      authuser.role == 'user'
    ) {
      return this.orderService.cancelOrder(order);
    }
    console.log(order, authuser);
    throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
  }

  @UseGuards(JwtAuthGuard)
  async completeOrder(
    @CurrentUser() authuser,
    @Param() id: number,
  ): Promise<Order> {
    const order = await Order.findOne({ id: id });
    if (!order) {
      throw new HttpException('Order not found', HttpStatus.BAD_REQUEST);
    }
    if (
      (authuser.role === 'driver' && order.customerId === authuser.id) ||
      authuser.role == 'user'
    ) {
      return this.orderService.completeOrder(order);
    }
    console.log('Complete Order', order, authuser);
    throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
  }

  @Get(':id/logs')
  async getOrderLogs(@Param() orderId: number): Promise<OrderLog[]> {
    return await this.orderService.getOrderLogs(orderId);
  }
}
