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
import { Role } from 'src/role/entity/role.entity';
import { PermissionGuard } from 'src/guards/permission-guard';
import { Permissions } from 'src/decorators/permissions.decorator';

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
    if (!(await this.checkIfLatlongIsInAGeofence(createOrderDto.latlong))) {
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
  async getOrdersForCustomer(
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
    // const role: Role = JSON.parse(driver.role);
    // if (role.alias !== 'driver') {
    //   Logger.log('Forbidden! You must be a driver to accept orders.');
    //   throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    // }
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

  async checkIfLatlongIsInAGeofence(
    customerLocation: string,
  ): Promise<boolean> {
    const geofences = await Geofence.find({ status: GeofenceStatus.Active }); // @TODO pick in small chucks in case data grows
    Logger.debug('Geofences', JSON.stringify(geofences));
    if (geofences.length) {
      for (const geofence of geofences) {
        Logger.debug('Checking geofence', { geofence });
        const geoLatLong = geofence.focusPoint.split(',');
        const focusPointLatitude = +geoLatLong[1];
        const focusPointLongitude = +geoLatLong[0];
        const customerLatLong = customerLocation.split(',');
        const customerLatitude = +customerLatLong[1];
        const customerLongitude = +customerLatLong[0];
        const customerPoint = 'user:' + customerLocation; // Should be unique
        const focusPoint = 'focuspoint:' + geofence.name;
        await this.redis.geoadd(
          focusPoint,
          focusPointLongitude,
          focusPointLatitude,
          geofence.name,
          customerLongitude,
          customerLatitude,
          customerPoint,
        );
        Logger.debug(
          'Geofences after geoadd',
          JSON.stringify(customerLatitude),
        );
        const distance = await this.redis.geodist(
          focusPoint,
          geofence.name,
          customerPoint,
          'km',
        );
        Logger.debug('After geodist', JSON.stringify(distance));
        if (distance <= geofence.radius) {
          this.redis.zrem(focusPoint, customerPoint);
          Logger.debug(
            'geofence is within range',
            JSON.stringify(customerPoint),
          );
          return true;
        }
      }
      Logger.debug('Returned false');

      return false;
    }
    Logger.debug('No active geofences have been found');
    return false;
  }
}
