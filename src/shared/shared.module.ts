import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CustomerService } from 'src/customer/customer.service';
import { ProductService } from 'src/product/product.service';
import { InvoiceService } from 'src/invoice/invoice.service';
import { DriverService } from 'src/driver/driver.service';
import { NotificationModule } from 'src/notification/notification.module';
import { RoleModule } from 'src/role/role.module';
import { PermissionModule } from 'src/permission/permission.module';

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
    NotificationModule,
    RoleModule,
    PermissionModule,
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
    RoleModule,
    PermissionModule,
  ],
})
export class SharedModule {}
