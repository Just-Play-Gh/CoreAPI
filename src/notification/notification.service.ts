import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { Otp } from 'src/customer/auth/entities/otp.entity';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import * as dayjs from 'dayjs';
import { lastValueFrom, map } from 'rxjs';
@Injectable()
export class NotificationService {
  constructor(private readonly httpService: HttpService) {}

  async sendSMS(phoneNumber: string, message: string): Promise<boolean> {
    const url = new URL(process.env.HUBTEL_SMS_CLIENT_URL);
    url.searchParams.append('clientid', process.env.HUBTEL_SMS_CLIENT_ID);
    url.searchParams.append(
      'clientsecret',
      process.env.HUBTEL_SMS_CLIENT_SECRET,
    );
    url.searchParams.append('from', process.env.HUBTEL_SMS_CLIENT_FROM);
    url.searchParams.append('to', phoneNumber);
    url.searchParams.append('content', message);
    const response = await lastValueFrom(
      this.httpService.get(url.toString()).pipe(map((res) => res.data)),
    );
    console.log(response);
    if (response && response.status === 0) {
      return true;
    }
    return false;
  }
  async sendOTP(phoneNumber): Promise<{ otp: string }> {
    //send the otp
    return { otp: this.generateOtp(4) };
  }

  async verifyOTP(VerifyOtpDto: VerifyOtpDto): Promise<boolean> {
    const { phoneNumber, otp } = VerifyOtpDto;
    const otpRecord = await Otp.findOne(
      { phoneNumber },
      {
        order: {
          id: 'DESC',
        },
      },
    );
    if (!otpRecord)
      throw new HttpException('Unknown User', HttpStatus.BAD_REQUEST);
    const otpValid = dayjs().diff(dayjs(otpRecord.created), 'seconds');
    const otpVerified = await otpRecord.validateToken(otp);
    if (!otpVerified)
      throw new HttpException('Invalid OTP', HttpStatus.BAD_REQUEST);
    if (otpValid > +process.env.OTP_EXPIRES_IN_SECONDS)
      throw new HttpException('OTP has expired', HttpStatus.BAD_REQUEST);
    return true;
  }

  generateOtp(len: number): string {
    return Math.floor(
      Number('1'.padEnd(len, '0')) +
        Math.random() * Number('9'.padEnd(len, '9')),
    ).toString();
  }
}
