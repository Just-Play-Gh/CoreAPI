import { CacheModule, Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CustomerService } from '../customer/customer.service';
import { ProductService } from '../product/product.service';
import { InvoiceService } from '../invoice/invoice.service';
import { DriverService } from '../driver/driver.service';
import { NotificationModule } from '../notification/notification.module';
import { RoleModule } from '../role/role.module';
import { PermissionModule } from '../permission/permission.module';

@Module({
  imports: [
    CacheModule.register(),
    HttpModule,
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async () => ({
        secret: process.env.JWT_SECRET || '123456',
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
    CacheModule,
  ],
})
export class SharedModule {}
