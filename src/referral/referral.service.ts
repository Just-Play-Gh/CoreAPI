import { Injectable } from '@nestjs/common';
import { UserReferral } from './enitities/userReferral.entity';

@Injectable()
export class ReferralService {
  async store() {
    const referral = UserReferral.create();
  }
}
