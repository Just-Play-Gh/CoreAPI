import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { NotificationModule } from 'src/notification/notification.module';
import { AuthenticationController } from './authentication.controller';
import { AuthenticationService } from './authentication.service';
import { JwtStrategy } from './jwt.strategy';
import { RefreshStrategy } from './refresh.strategy';

@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async () => ({
        secret: process.env.JWT_SECRET,
        signOptions: { expiresIn: '20s' },
      }),
      inject: [ConfigService],
    }),
    NotificationModule,
  ],
  controllers: [AuthenticationController],
  providers: [AuthenticationService, JwtStrategy, RefreshStrategy],
})
export class AuthenticationModule {}
