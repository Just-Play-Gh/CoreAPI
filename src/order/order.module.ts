import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { SharedModule } from 'src/shared/shared.module';
import { HttpModule } from '@nestjs/axios';
import { OrderCreatedListener } from './listeners/order-created.listener';

@Module({
  imports: [SharedModule, HttpModule],
  providers: [OrderService, OrderCreatedListener],
  controllers: [OrderController],
})
export class OrderModule {}
