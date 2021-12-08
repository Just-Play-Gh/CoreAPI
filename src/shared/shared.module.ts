import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CustomerService } from 'src/customer/customer.service';
import { ProductModule } from 'src/product/product.module';
import { ProductService } from 'src/product/product.service';
import { InvoiceModule } from 'src/invoice/invoice.module';
import { InvoiceService } from 'src/invoice/invoice.service';
import { DriverService } from 'src/driver/driver.service';
import { NotificationModule } from 'src/notification/notification.module';

@Module({
  imports: [
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
    HttpModule,
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
