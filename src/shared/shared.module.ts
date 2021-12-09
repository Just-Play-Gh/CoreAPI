import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CustomerService } from '../customer/customer.service';
import { ProductModule } from '../product/product.module';
import { ProductService } from '../product/product.service';
import { InvoiceModule } from '../invoice/invoice.module';
import { InvoiceService } from '../invoice/invoice.service';
import { DriverService } from '../driver/driver.service';
import { NotificationModule } from '../notification/notification.module';

@Module({
  imports: [
    HttpModule,
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async () => ({
        secret: process.env.JWT_SECRET,
      }),
      inject: [ConfigService],
    }),
    ProductModule,
    NotificationModule,
  ],
  providers: [CustomerService, DriverService, ProductService, InvoiceService],
  exports: [
    PassportModule,
    JwtModule,
    CustomerService,
    DriverService,
    ProductService,
    InvoiceService,
    NotificationModule,
  ],
})
export class SharedModule {}
