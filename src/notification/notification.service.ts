import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { send } from 'process';
import { PasswordReset } from 'src/customer/auth/entities/password-reset.entity';
import { UserService } from 'src/customer/user/user.service';
import { SendOtpDto } from './dto/send-otp.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';

@Injectable()
export class NotificationService {
  constructor(private readonly userService: UserService) {}

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
    if (!passwordReset) return false;
    return passwordReset.validateToken(otp);
  }

  generateOtp(len: number): string {
    return Math.floor(
      Number('1'.padEnd(len, '0')) +
        Math.random() * Number('9'.padEnd(len, '9')),
    ).toString();
  }
}
