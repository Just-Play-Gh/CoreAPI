import { Module } from '@nestjs/common';
import { ReferralService } from './referral.service';

@Module({
  providers: [ReferralService]
})
export class ReferralModule {}
