import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Otp } from 'src/customer/auth/entities/otp.entity';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import * as dayjs from 'dayjs';
@Injectable()
export class NotificationService {
  async sendOTP(phoneNumber): Promise<{ otp: string }> {
    //send the otp
    return { otp: this.generateOtp(6) };
  }

  async verifyOTP(VerifyOtpDto: VerifyOtpDto): Promise<boolean> {
    const { phoneNumber, otp } = VerifyOtpDto;
    const otpRecord = await Otp.findOne({ phoneNumber });
    if (!otpRecord)
      throw new HttpException('Unknown User', HttpStatus.BAD_REQUEST);
    const otpValid = dayjs().diff(dayjs(otpRecord.created), 'seconds');
    if (otpValid > +process.env.OTP_EXPIRES_IN_SECONDS)
      throw new HttpException('OTP has expired', HttpStatus.BAD_REQUEST);
    const otpVerified = await otpRecord.validateToken(otp);
    if (!otpVerified)
      throw new HttpException('Invalid OTP', HttpStatus.BAD_REQUEST);
    return true;
  }

  generateOtp(len: number): string {
    return Math.floor(
      Number('1'.padEnd(len, '0')) +
        Math.random() * Number('9'.padEnd(len, '9')),
    ).toString();
  }
}
