import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { SharedModule } from 'src/shared/shared.module';
import { HttpModule } from '@nestjs/axios';
import { AppGateway } from 'src/app.gateway';
import { OrderEventListeners } from './listeners/order-events.listener';

@Module({
  imports: [SharedModule, HttpModule],
  providers: [OrderService, OrderEventListeners, AppGateway],
  controllers: [OrderController],
})
export class OrderModule {}
