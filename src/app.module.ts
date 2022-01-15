import { Module } from '@nestjs/common';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CustomerModule } from './customer/customer.module';
import { DatabaseModule } from './database/database.module';
import { ConfigModule } from '@nestjs/config';
import { CallbackModule } from './callback/callback.module';
import { OrderModule } from './order/order.module';
import { SharedModule } from './shared/shared.module';
import { InvoiceModule } from './invoice/invoice.module';
import { DriverModule } from './driver/driver.module';
import { AuthenticationModule } from './authentication/authentication.module';
import { NotificationModule } from './notification/notification.module';
import { UsersModule } from './users/users.module';
import { JwtStrategy } from './authentication/jwt.strategy';
import { TaxModule } from './tax/tax.module';
import { RoleController } from './role/role.controller';
import { VehicleModule } from './vehicles/vehicle.module';
import { DeviceModule } from './device/device.module';
import { ReviewModule } from './reviews/review/review.module';
import { ReviewSummaryModule } from './reviews/review-summary/review-summary.module';
import { ConfigurationModule } from './configuration/configuration.module';
import { AppGateway } from './app.gateway';
import { RedisModule } from '@nestjs-modules/ioredis';
import { ActivityLogsModule } from './activity-logs/activity-logs.module';
import { ReferralModule } from './referral/referral.module';
import { TruckModule } from './truck/truck.module';
import { MarketingModule } from './marketing/marketing.module';
@Module({
  imports: [
    DriverModule,
    CustomerModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    RedisModule.forRoot({
      config: {
        url: process.env.REDIS_HOST,
        password: process.env.REDIS_SECRET,
      },
    }),
    EventEmitterModule.forRoot({
      // set this to `true` to use wildcards
      wildcard: false,
      // the delimiter used to segment namespaces
      delimiter: '.',
      // set this to `true` if you want to emit the newListener event
      newListener: false,
      // set this to `true` if you want to emit the removeListener event
      removeListener: false,
      // the maximum amount of listeners that can be assigned to an event
      maxListeners: 3,
      // show event name in memory leak message when more than maximum amount of listeners is assigned
      verboseMemoryLeak: false,
      // disable throwing uncaughtException if an error event is emitted and it has no listeners
      ignoreErrors: false,
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
    DeviceModule,
    ReviewSummaryModule,
    ConfigurationModule,
    ActivityLogsModule,
    ReferralModule,
    TruckModule,
    MarketingModule,
  ],
  controllers: [AppController, RoleController],
  providers: [AppService, JwtStrategy, AppGateway],
})
export class AppModule {}
