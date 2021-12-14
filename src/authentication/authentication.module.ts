import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { NotificationModule } from '../notification/notification.module';
import { SharedModule } from '../shared/shared.module';
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
        signOptions: {
          expiresIn: `${process.env.JWT_TOKEN_EXPIRES_IN_SECONDS}s`,
        },
      }),
      inject: [ConfigService],
    }),
    NotificationModule,
    SharedModule,
  ],
  controllers: [AuthenticationController],
  providers: [AuthenticationService, JwtStrategy, RefreshStrategy],
})
export class AuthenticationModule {}
