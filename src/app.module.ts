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
import { AuthenticationModule } from './authentication/authentication.module';
import { NotificationModule } from './notification/notification.module';

import { UsersModule } from './users/users.module';
import { JwtStrategy } from './authentication/jwt.strategy';
import { TaxModule } from './tax/tax.module';
import { RoleController } from './role/role.controller';
import { VehicleModule } from './vehicle/vehicle.module';
@Module({
  imports: [
    DriverModule,
    CustomerModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    DatabaseModule,
    UsersModule,
    SharedModule,
    InvoiceModule,
    CallbackModule,
    OrderModule,
    ReviewModule,
    AuthenticationModule,
    NotificationModule,
    TaxModule,
    VehicleModule,
  ],
  controllers: [AppController, RoleController],
  providers: [AppService, JwtStrategy],
})
export class AppModule {}
