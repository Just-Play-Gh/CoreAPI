import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DriverModule } from './driver/driver.module';
import { CustomerModule } from './customer/customer.module';
import { SharedModule } from './shared/shared.module';
import { DatabaseModule } from './database/database.module';
import { ConfigModule } from '@nestjs/config';
import { ProductModule } from './product/product.module';
import { TaxModule } from './tax/tax.module';
import { InvoiceModule } from './invoice/invoice.module';
import { CallbackModule } from './callback/callback.module';
import { OrderModule } from './order/order.module';
@Module({
  imports: [
    DriverModule,
    CustomerModule,
    SharedModule,
    ConfigModule.forRoot(),
    DatabaseModule,
    ProductModule,
    TaxModule,
    InvoiceModule,
    CallbackModule,
    OrderModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
