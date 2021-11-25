import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DriverModule } from './driver/driver.module';
import { CustomerModule } from './customer/customer.module';
import { DatabaseModule } from './database/database.module';
import { ConfigModule } from '@nestjs/config';
import { TaxModule } from './tax/tax.module';
import { CallbackModule } from './callback/callback.module';
import { OrderModule } from './order/order.module';
import { SharedModule } from './shared/shared.module';
@Module({
  imports: [
    DriverModule,
    CustomerModule,
    ConfigModule.forRoot(),
    DatabaseModule,
    SharedModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
