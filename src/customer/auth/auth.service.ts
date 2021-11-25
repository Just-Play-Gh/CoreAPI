import {
  ConflictException,
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { SendOtpDto } from 'src/notification/dto/send-otp.dto';
import { VerifyOtpDto } from 'src/notification/dto/verify-otp.dto';
import { NotificationService } from 'src/notification/notification.service';
import { User } from '../user/entities/user.entity';
import { UserService } from '../user/user.service';
import { LoginDto } from './dto/login.dto';
import { ResetPasswordDto } from './dto/password-reset.dto';
import { RegisterDto } from './dto/register.dto';
import { PasswordReset } from './entities/password-reset.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly notificationService: NotificationService,
  ) {}
  async register(registerData: RegisterDto): Promise<User> {
    const user = User.create();
    for (const key in registerData) {
      user[key] = registerData[key];
    }
    user.status = true;
    const userExists = await User.findOne({
      phoneNumber: user.phoneNumber,
    });
    if (userExists) {
      throw new ConflictException('User already exists');
    }
    await User.save(user);
    return user;
  }

  async login(loginData: LoginDto): Promise<User> {
    try {
      const user = await this.validateUser(loginData);
      const payload = {
        id: user.id,
        phoneNumber: user.phoneNumber,
      };
      user['access_token'] = this.jwtService.sign(payload);
      return user;
    } catch (error) {
      console.log(error);
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    }
  }

  async validateUser(loginDto: LoginDto): Promise<User> {
    const { phoneNumber, password } = loginDto;

    const user = await this.userService.getUser({ phoneNumber });
    if (!(await user?.validatePassword(password))) {
      throw new UnauthorizedException();
    }

    return user;
  }

  async sendResetPasswordOTP(
    sendOtpDto: SendOtpDto,
  ): Promise<{ message: string }> {
    try {
      const { otp } = await this.notificationService.sendOTP(sendOtpDto);
      const passwordReset = PasswordReset.create();
      passwordReset['phoneNumber'] = sendOtpDto.phoneNumber;
      passwordReset['token'] = otp;
      console.log(passwordReset);
      await PasswordReset.save(passwordReset);
      return { message: 'OTP successfully sent' };
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async verifyOTP(verifyOtpDto: VerifyOtpDto): Promise<{ message: string }> {
    try {
      await this.notificationService.verifyOTP(verifyOtpDto);
      return { message: 'Verification successful' };
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async resetPassword(
    resetPasswordDto: ResetPasswordDto,
  ): Promise<{ message: string }> {
    const { phoneNumber, otp, password, passwordConfirmation } =
      resetPasswordDto;
    try {
      await this.verifyOTP({ phoneNumber, otp });
      if (password !== passwordConfirmation)
        throw new HttpException(
          'Passwords do not match',
          HttpStatus.BAD_REQUEST,
        );
      const user = await this.userService.getUser({ phoneNumber });
      if (!user) throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
      await this.userService.updateUserByPhoneNumber({ phoneNumber, password });
      await PasswordReset.delete({ phoneNumber });
      return { message: 'Password reset successful' };
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}
