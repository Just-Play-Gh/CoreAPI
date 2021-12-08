import {
  Body,
  ClassSerializerInterceptor,
  ConflictException,
  Controller,
  Post,
  UseInterceptors,
} from '@nestjs/common';
import { SendOtpDto } from 'src/notification/dto/send-otp.dto';
import { VerifyOtpDto } from 'src/notification/dto/verify-otp.dto';
import { CustomerService } from '../customer.service';
import { Customer } from '../entities/customer.entity';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { OAuthLoginDto } from './dto/oauth-login.dto';
import { ResetPasswordDto } from './dto/password-reset.dto';
import { RegisterDto } from './dto/register.dto';

@UseInterceptors(ClassSerializerInterceptor)
@Controller('authme')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private customerService: CustomerService,
  ) {}
  @Post('/register')
  async register(@Body() registerDto: RegisterDto): Promise<Customer> {
    return this.authService.register(registerDto);
  }
  @Post('/register/send-otp')
  async sendOTP(@Body() sendOtpDto: SendOtpDto) {
    const { phoneNumber, country, email } = sendOtpDto;
    // Check if customer already exists
    const customer =
      (await this.customerService.getCustomerByPhoneNumber({
        phoneNumber,
        country,
      })) ||
      (await this.customerService.getCustomerByEmail({
        email,
      }));
    if (customer) {
      throw new ConflictException('Account already exists');
    }
    return this.authService.sendOTP(sendOtpDto);
  }

  @Post('/login')
  async login(@Body() loginDto: LoginDto): Promise<Customer> {
    return this.authService.login(loginDto);
  }

  @Post('/login/OAuth')
  async oAuthLogin(@Body() oAuthLoginDto: OAuthLoginDto): Promise<Customer> {
    return this.authService.oAuthLogin(oAuthLoginDto);
  }

  @Post('send-reset-otp')
  async sendResetPasswordOTP(
    @Body() sendOtpDto: SendOtpDto,
  ): Promise<{ message: string }> {
    return this.authService.sendResetPasswordOTP(sendOtpDto);
  }

  @Post('/verify-otp')
  async verifyOTP(
    @Body() verifyOtpDto: VerifyOtpDto,
  ): Promise<{ message: string }> {
    return this.authService.verifyOTP(verifyOtpDto);
  }

  @Post('/reset-password')
  async resetPassword(
    @Body() resetPasswordDto: ResetPasswordDto,
  ): Promise<{ message: string }> {
    return this.authService.resetPassword(resetPasswordDto);
  }
}
