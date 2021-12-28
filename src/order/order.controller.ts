import {
  Body,
  Controller,
  DefaultValuePipe,
  Get,
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

@Controller('orders')
export class OrderController extends BaseController {
  constructor(private readonly orderService: OrderService) {
    super(orderService);
    this.dtos = { store: CreateOrderDto, update: UpdateOrderDto };
  }
  @UseGuards(JwtAuthGuard)
  @UseGuards(JwtAuthGuard)
  @Post()
  async store(@CurrentUser() customer, @Body() body): Promise<Order> {
    return this.orderService.store(body, customer);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/my-orders')
  async findAll(
    @CurrentUser() customer,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page = 1,
    @Query('limit', new DefaultValuePipe(15), ParseIntPipe) limit = 15,
    @Query() getOrders: GetOrderDto,
  ) {
    delete getOrders.page;
    delete getOrders.limit;
    return this.orderService.getMyOrders(
      { page, limit },
      { customerId: customer.id },
    );
  }

  // Should have permission to accept or role
  @UseGuards(JwtAuthGuard)
  @Get(':id/accept')
  async acceptOrder(
    @CurrentUser() driver,
    @Param() id: string,
  ): Promise<Order> {
    return this.orderService.acceptOrder(driver.id, id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id/cancel')
  async cancelOrder(
    @CurrentUser() customer,
    @Param() id: string,
  ): Promise<Order> {
    return this.orderService.cancelOrder(id, customer);
  }

  @Get(':id/logs')
  async getOrderLogs(@Param() orderId: number): Promise<OrderLog[]> {
    return await this.orderService.getOrderLogs(orderId);
  }
}
