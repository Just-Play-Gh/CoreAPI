import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { SharedModule } from 'src/shared/shared.module';

@Module({
  providers: [OrderService],
  controllers: [OrderController],
  imports: [SharedModule],
})
export class OrderModule {}
