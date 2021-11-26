import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { RatingsModule } from './ratings/ratings.module';

@Module({
  imports: [AuthModule, UserModule, RatingsModule],
  providers: [],
})
export class CustomerModule {}
