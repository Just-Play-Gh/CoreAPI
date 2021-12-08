import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Otp } from 'src/customer/auth/entities/otp.entity';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import * as dayjs from 'dayjs';
import { MailerService } from '@nestjs-modules/mailer';
@Injectable()
export class NotificationService {
  constructor(private readonly mailerService: MailerService) {}

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
