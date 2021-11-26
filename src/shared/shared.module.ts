import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CustomerService } from 'src/customer/customer.service';
import { NotificationService } from 'src/notification/notification.service';
import { ProductModule } from 'src/product/product.module';
import { ProductService } from 'src/product/product.service';
import { InvoiceModule } from 'src/invoice/invoice.module';
import { InvoiceService } from 'src/invoice/invoice.service';

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
  ],
  providers: [
    CustomerService,
    NotificationService,
    ProductService,
    InvoiceService,
  ],
  exports: [
    PassportModule,
    JwtModule,
    CustomerService,
    NotificationService,
    ProductService,
    InvoiceService,
  ],
})
export class SharedModule {}
