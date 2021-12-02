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
import { CustomerService } from '../customer.service';
import { GetCustomerByEmailDto } from '../dto/get-customer-by-email.dto';
import { Customer } from '../entities/customer.entity';
import { LoginDto } from './dto/login.dto';
import { OAuthLoginDto } from './dto/oauth-login.dto';
import { ResetPasswordDto } from './dto/password-reset.dto';
import { RegisterDto } from './dto/register.dto';
import { Otp } from './entities/otp.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly customerService: CustomerService,
    private readonly jwtService: JwtService,
    private readonly notificationService: NotificationService,
  ) {}
  async register(registerData: RegisterDto): Promise<Customer> {
    const customer = Customer.create();
    for (const key in registerData) {
      customer[key] = registerData[key];
    }
    customer.status = true;
    const customerExists = await Customer.findOne({
      phoneNumber: customer.phoneNumber,
    });
    if (customerExists) {
      throw new ConflictException('Customer already exists');
    }
    await Customer.save(customer);
    return customer;
  }

  async login(loginData: LoginDto): Promise<Customer> {
    try {
      const user = await this.validateUser(loginData);
      return this.generateToken(user);
    } catch (error) {
      console.log(error);
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    }
  }

  async oAuthLogin(oAuthLogin: OAuthLoginDto) {
    try {
      const user = await this.validateOAuthUser(oAuthLogin);
      return this.generateToken(user);
    } catch (error) {
      console.log(error);
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    }
  }

  async validateUser(loginDto: LoginDto): Promise<Customer> {
    const { phoneNumber, password } = loginDto;

    const customer = await this.customerService.getCustomer({ phoneNumber });
    if (!(await customer?.validatePassword(password))) {
      throw new UnauthorizedException();
    }

    return customer;
  }

  generateToken(user: Customer) {
    const payload = {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      phoneNumber: user.phoneNumber,
    };
    user['access_token'] = this.jwtService.sign(payload);
    return user;
  }

  async validateOAuthUser(
    getCustomerByEmailDto: GetCustomerByEmailDto,
  ): Promise<Customer> {
    const customer = await this.customerService.getOAuthCustomer(
      getCustomerByEmailDto,
    );
    if (!customer) {
      throw new UnauthorizedException();
    }
    return customer;
  }

  async sendOTPOnRegistration(
    sendOtpDto: SendOtpDto,
  ): Promise<{ message: string }> {
    try {
      const { phoneNumber } = sendOtpDto;
      const { otp } = await this.notificationService.sendOTP(phoneNumber);
      const passwordReset = Otp.create();
      passwordReset['phoneNumber'] = sendOtpDto.phoneNumber;
      passwordReset['token'] = otp;
      await Otp.save(passwordReset);
      return { message: 'OTP successfully sent' };
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async sendResetPasswordOTP(
    sendOtpDto: SendOtpDto,
  ): Promise<{ message: string }> {
    try {
      const { phoneNumber } = sendOtpDto;
      await this.customerService.getCustomer({ phoneNumber });
      const { otp } = await this.notificationService.sendOTP(phoneNumber);
      const passwordReset = Otp.create();
      passwordReset['phoneNumber'] = sendOtpDto.phoneNumber;
      passwordReset['token'] = otp;
      console.log(passwordReset);
      await Otp.save(passwordReset);
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
      const customer = await this.customerService.getCustomer({ phoneNumber });
      if (!customer) throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
      await this.customerService.updateCustomerByPhoneNumber({
        phoneNumber,
        password,
      });
      await Otp.delete({ phoneNumber });
      return { message: 'Password reset successful' };
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}
