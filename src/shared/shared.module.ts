import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UserService } from 'src/customer/user/user.service';
import { NotificationService } from 'src/notification/notification.service';
import { ProductModule } from 'src/product/product.module';

@Module({
  imports: [
    PassportModule,
    ProductModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async () => ({
        secret: process.env.JWT_SECRET,
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [UserService, NotificationService],
  exports: [
    PassportModule,
    JwtModule,
    UserService,
    NotificationService,
    ProductModule,
  ],
})
export class SharedModule {}
