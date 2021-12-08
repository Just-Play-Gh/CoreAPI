import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CustomerModule } from './customer/customer.module';
import { DatabaseModule } from './database/database.module';
import { ConfigModule } from '@nestjs/config';
import { CallbackModule } from './callback/callback.module';
import { OrderModule } from './order/order.module';
import { SharedModule } from './shared/shared.module';
import { InvoiceModule } from './invoice/invoice.module';
import { ReviewModule } from './review/review.module';
import { DriverModule } from './driver/driver.module';
import { RouterModule } from '@nestjs/core';
import { AuthenticationModule } from './authentication/authentication.module';
import { NotificationModule } from './notification/notification.module';

@Module({
  imports: [
    DriverModule,
    CustomerModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    DatabaseModule,
    SharedModule,
    InvoiceModule,
    CallbackModule,
    OrderModule,
    ReviewModule,
    AuthenticationModule,
    NotificationModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
