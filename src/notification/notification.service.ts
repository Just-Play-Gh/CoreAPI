import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PasswordReset } from 'src/customer/auth/entities/password-reset.entity';
import { SendOtpDto } from './dto/send-otp.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import * as dayjs from 'dayjs';
import { CustomerService } from 'src/customer/customer.service';
@Injectable()
export class NotificationService {
  public userService: CustomerService;

  async sendOTP(sendOtpDto: SendOtpDto): Promise<{ otp: string }> {
    const { phoneNumber } = sendOtpDto;
    const user = await this.userService.getUser({ phoneNumber });
    if (!user) throw new HttpException('Not Found', HttpStatus.NOT_FOUND);

    //send the otp
    return { otp: this.generateOtp(6) };
  }

  async verifyOTP(VerifyOtpDto: VerifyOtpDto): Promise<boolean> {
    const { phoneNumber, otp } = VerifyOtpDto;
    const passwordReset = await PasswordReset.findOne({ phoneNumber });
    if (!passwordReset)
      throw new HttpException('Unknown User', HttpStatus.BAD_REQUEST);
    const passwordValid = dayjs().diff(dayjs(passwordReset.created), 'seconds');
    if (passwordValid > +process.env.OTP_EXPIRES_IN_SECONDS)
      throw new HttpException('OTP has expired', HttpStatus.BAD_REQUEST);
    const otpVerified = await passwordReset.validateToken(otp);
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
