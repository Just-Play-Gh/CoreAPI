import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { SharedModule } from 'src/shared/shared.module';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [SharedModule, HttpModule],
  providers: [OrderService],
  controllers: [OrderController],
})
export class OrderModule {}
