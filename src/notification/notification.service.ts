import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import { MailerService } from '@nestjs-modules/mailer';
import { Otp } from '../otp/entity/otp.entity';
import dayjs from 'dayjs';
import { lastValueFrom, map } from 'rxjs';

@Injectable()
export class NotificationService {
  constructor(
    private readonly mailerService: MailerService,
    private readonly httpService: HttpService,
  ) {}

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
  async sendOTP(phoneNumber: string, otp: string): Promise<{ otp: string }> {
    //send the otp
    console.log(otp, phoneNumber);
    return { otp };
  }

  async sendForgotPasswordEmail(user, otp: string): Promise<string> {
    try {
      await this.mailerService.sendMail({
        to: user.email,
        subject: 'Reset Password',
        template: `./forgot-password`,
        context: {
          user: user,
          otp,
        },
      });
    } catch (error) {
      console.log('an error', error);
    }
    return '1';
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
      throw new HttpException('Invalid OTP', HttpStatus.BAD_REQUEST);
    const otpValid = dayjs().diff(dayjs(otpRecord.created), 'seconds');
    const otpVerified = await otpRecord.validateToken(otp);
    if (!otpVerified)
      throw new HttpException('Invalid OTP', HttpStatus.BAD_REQUEST);
    if (otpValid > +process.env.OTP_EXPIRES_IN_SECONDS)
      throw new HttpException('OTP has expired', HttpStatus.BAD_REQUEST);
    return true;
  }
}
