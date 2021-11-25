import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { SharedModule } from 'src/shared/shared.module';
import { JwtStrategy } from './jwt.strategy';

@Module({
  imports: [SharedModule],
  providers: [AuthService, JwtStrategy],
  controllers: [AuthController],
})
export class AuthModule {}
