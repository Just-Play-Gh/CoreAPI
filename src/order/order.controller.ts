import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CurrentUser } from 'src/decorators/current-user.decorator';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { BaseController } from 'src/resources/base.controller';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { Order } from './entities/order.entity';
import { OrderService } from './order.service';

@Controller('orders')
export class OrderController extends BaseController {
  constructor(private readonly orderService: OrderService) {
    super(orderService);
    this.dtos = { store: CreateOrderDto, update: UpdateOrderDto };
  }

  @UseGuards(JwtAuthGuard)
  @Get('my-orders')
  async getMyOrders(@CurrentUser() customer): Promise<Order[]> {
    return this.orderService.getMyOrders(customer);
  }

  @Get(':id/accept')
  async acceptOrder(
    @CurrentUser() driver,
    @Param() id: string,
  ): Promise<Order> {
    return this.orderService.acceptOrder(driver.id, id);
  }
}
