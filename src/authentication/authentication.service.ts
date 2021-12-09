import {
  ConflictException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CountryCode, parsePhoneNumber } from 'libphonenumber-js';
import { generateOtp, generatePassword } from '../helpers/generator';
import { validateDto } from '../helpers/validator';
import { SendOtpDto } from '../notification/dto/send-otp.dto';
import { VerifyOtpDto } from '../notification/dto/verify-otp.dto';
import { NotificationService } from '../notification/notification.service';
import { StatusType, userEntities } from '../types';
import { ChangePasswordDto } from './dto/change-password.dto';
import {
  SendForgotPasswordEmail,
  SendForgotPasswordOtp,
} from './dto/forgot-password.dto';
import { LoginDto } from './dto/login.dto';
import { RegisterCustomerDto } from './dto/register-customer.dto';
import { RegisterDriverDto } from './dto/register-driver.dto';
import {
  ResetPasswordEmailDto,
  ResetPasswordOtpDto,
} from './dto/reset-password.dto';
import * as randomToken from 'rand-token';
import dayjs from 'dayjs';
import { Request, Response } from 'express';
import { AccessToken } from './entity/access-token.entity';
import { RefreshToken } from './entity/refresh-token.entity';
import { Otp } from '../otp/entity/otp.entity';

@Injectable()
export class AuthenticationService {
  constructor(
    private jwtService: JwtService,
    private readonly notificationService: NotificationService,
  ) {}

  async login(body, queries, res: Response) {
    try {
      // Get query params
      const { contain } = queries;
      // Destruct login body
      const { phoneNumber, country, userType, password } = body;
      // Valid login body
      const validDto = await validateDto(new LoginDto(), body);
      if (Object.keys(validDto).length > 0)
        throw new HttpException(validDto, HttpStatus.BAD_REQUEST);
      // Parse phone number to international standard
      const parsePhone = parsePhoneNumber(
        phoneNumber,
        country as CountryCode,
      ).number.substring(1);

      // Find user
      const user = await userEntities[userType].findOne(
        {
          phoneNumber: String(parsePhone),
          status: StatusType.Active,
        },
        { relations: contain?.split(',') },
      );

      if (!user || !(await user?.validatePassword(password)))
        throw new UnauthorizedException();
      return this.generateToken(user, res);
    } catch (error) {
      throw error;
    }
  }

  async registerDriver(body, res) {
    try {
      // Valid login body
      const validDto = await validateDto(new RegisterDriverDto(), body);
      if (Object.keys(validDto).length > 0)
        throw new HttpException(validDto, HttpStatus.BAD_REQUEST);
      return this.register(body, res);
    } catch (error) {
      throw error;
    }
  }

  async registerCustomerSendOtp(body) {
    try {
      const validDto = await validateDto(new SendOtpDto(), body);
      if (Object.keys(validDto).length > 0)
        throw new HttpException(validDto, HttpStatus.BAD_REQUEST);
      const { phoneNumber, country } = body;
      const parsePhone = parsePhoneNumber(
        phoneNumber,
        (country ?? 'GH') as CountryCode,
      ).number.substring(1);
      // Generate otp
      const otp = generateOtp(4);
      // Save otp
      await this.saveOtp(parsePhone, otp);
      // Send otp as sms
      await this.notificationService.sendOTP(parsePhone, otp);
      return { message: 'OTP successful sent' };
    } catch (error) {
      throw error;
    }
  }

  async registerCustomerVerifyOtp(body) {
    try {
      const validDto = await validateDto(new VerifyOtpDto(), body);
      if (Object.keys(validDto).length > 0)
        throw new HttpException(validDto, HttpStatus.BAD_REQUEST);
      const { phoneNumber, country, otp } = body;
      const parsePhone = parsePhoneNumber(
        phoneNumber,
        (country ?? 'GH') as CountryCode,
      ).number.substring(1);
      await this.notificationService.verifyOTP({
        phoneNumber: parsePhone,
        otp,
      });
      await Otp.delete({ phoneNumber: parsePhone });
      return { message: 'OTP successful verified' };
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async registerCustomer(body, res: Response) {
    try {
      // Valid login body
      const validDto = await validateDto(new RegisterCustomerDto(), body);
      if (Object.keys(validDto).length > 0)
        throw new HttpException(validDto, HttpStatus.BAD_REQUEST);
      return this.register(body, res);
    } catch (error) {
      throw error;
    }
  }

  async register(body, res: Response) {
    // Destruct register body
    const { userType, email, phoneNumber, country = 'GH', password } = body;
    // Parse phone number to international standard
    const parsePhone = parsePhoneNumber(
      phoneNumber,
      country as CountryCode,
    ).number.substring(1);
    const user = userEntities[userType].create();
    const userExists = await this.findUser(userType, parsePhone, email);
    if (userExists) {
      throw new ConflictException(
        `${
          userType.charAt(0).toUpperCase() + userType.slice(1)
        } already exists`,
      );
    }
    for (const key in body) {
      if (
        key in userEntities[userType].getRepository().metadata.propertiesMap
      ) {
        user[key] = body[key];
      }
    }
    user.password = password ?? generatePassword(6);
    user.country = country;
    user.phoneNumber = parsePhone;
    user.status = StatusType.Active;
    await userEntities[userType].save(user);
    return this.generateToken(user, res);
  }

  async sendForgotPasswordOtp(body) {
    try {
      const validDto = await validateDto(new SendForgotPasswordOtp(), body);
      if (Object.keys(validDto).length > 0)
        throw new HttpException(validDto, HttpStatus.BAD_REQUEST);
      const { userType, phoneNumber, country } = body;
      const parsePhone = parsePhoneNumber(
        phoneNumber,
        (country ?? 'GH') as CountryCode,
      ).number.substring(1);
      const userExists = await this.findUser(userType, parsePhone);
      if (!userExists) throw new NotFoundException('User account not found');
      // Generate otp
      const otp = generateOtp(4);
      // Save otp
      await this.saveOtp(parsePhone, otp);
      // Send otp as sms
      await this.notificationService.sendOTP(parsePhone, otp);
      return { message: 'OTP successfully sent' };
    } catch (error) {
      throw error;
    }
  }

  async sendForgotPasswordEmail(body) {
    try {
      const validDto = await validateDto(new SendForgotPasswordEmail(), body);
      if (Object.keys(validDto).length > 0)
        throw new HttpException(validDto, HttpStatus.BAD_REQUEST);
      const { userType, email } = body;
      const user = await this.findUser(userType, null, email);
      if (!user) throw new NotFoundException('User account not found');
      // Generate otp
      const otp = generateOtp(9);
      // Save otp
      await this.saveOtp(user.phoneNumber, otp);
      // Send forgot password email
      await this.notificationService.sendForgotPasswordEmail(user, otp);
      return { message: 'Email successfully sent' };
    } catch (error) {
      throw error;
    }
  }

  async resetOtpPassword(body) {
    try {
      const validDto = await validateDto(new ResetPasswordOtpDto(), body);
      if (Object.keys(validDto).length > 0)
        throw new HttpException(validDto, HttpStatus.BAD_REQUEST);
      const { userType, phoneNumber, country, otp, password } = body;
      const parsePhone = parsePhoneNumber(
        phoneNumber,
        (country ?? 'GH') as CountryCode,
      ).number.substring(1);
      await this.notificationService.verifyOTP({
        phoneNumber: parsePhone,
        otp,
      });
      const user = await this.findUser(userType, parsePhone);
      if (!user) throw new NotFoundException('User account not found');
      user.password = password;
      await user.save();
      await Otp.delete({ phoneNumber: parsePhone });
      return { message: 'Password reset successful' };
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async resetEmailPassword(body) {
    try {
      const validDto = await validateDto(new ResetPasswordEmailDto(), body);
      if (Object.keys(validDto).length > 0)
        throw new HttpException(validDto, HttpStatus.BAD_REQUEST);
      const { userType, email, otp, password } = body;
      const user = await this.findUser(userType, null, email);
      if (!user) throw new NotFoundException('User account not found');
      await this.notificationService.verifyOTP({
        phoneNumber: user.phoneNumber,
        otp,
      });
      user.password = password;
      await user.save();
      await Otp.delete({ phoneNumber: user.phoneNumber });
      return { message: 'Password reset successful' };
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async changePassword(body, userContext) {
    try {
      const validDto = await validateDto(new ChangePasswordDto(), body);
      if (Object.keys(validDto).length > 0)
        throw new HttpException(validDto, HttpStatus.BAD_REQUEST);
      const { userType, currentPassword, newPassword } = body;
      const user = await userEntities[userType].findOne({ id: userContext.id });
      if (!user || !user.validatePassword(currentPassword))
        throw new HttpException('Invalid Password', HttpStatus.BAD_REQUEST);
      user.password = newPassword;
      await userEntities[userType].save(user);
      return { message: 'Password changed successful' };
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async refreshToken(userContext, req: Request, res: Response) {
    const token = this.jwtService.sign(userContext);
    const refreshToken = req?.cookies['auth-cookie']?.refreshToken;
    const secretData = {
      token: token,
      refreshToken: refreshToken ?? (await this.getRefreshToken()),
    };
    res.cookie('auth-cookie', secretData, { httpOnly: true });
    return { message: 'Refresh successful' };
  }

  async saveOtp(phoneNumber, otp) {
    //Find user otp
    const findOtp = await Otp.getRepository()
      .createQueryBuilder()
      .where({ phoneNumber })
      .getOne();
    // Delete otp if it exists before creating a new one
    if (findOtp) {
      Otp.delete({ phoneNumber });
    }
    // Create new otp
    const passwordReset = Otp.create();
    passwordReset['phoneNumber'] = phoneNumber;
    passwordReset['token'] = otp;
    await Otp.save(passwordReset);
  }

  async findUser(
    userType: string,
    phoneNumber: string | null = null,
    email: string | null = null,
  ) {
    return await userEntities[userType]
      .getRepository()
      .createQueryBuilder()
      .where({ phoneNumber })
      .orWhere({ email })
      .getOne();
  }

  async generateToken(user, res: Response) {
    const payload = {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      phoneNumber: user.phoneNumber,
    };
    user['accessToken'] = this.jwtService.sign(payload);

    const secretData = {
      token: user.accessToken,
      refreshToken: await this.getRefreshToken(),
    };
    res.cookie('auth-cookie', secretData, { httpOnly: true });
    user['refreshToken'] = secretData.refreshToken.token;
    delete user.password;
    // Save user access token
    // Check if user has token
    await this.saveAccessToken(user);
    await this.saveRefreshToken(user);
    return user;
  }

  async saveAccessToken(user) {
    let userToken = await AccessToken.findOne({ userId: user.id });
    if (userToken) {
      userToken.token = user.accessToken;
    } else {
      userToken = AccessToken.create();
      userToken.userId = user.id;
      userToken.token = user.accessToken;
    }
    userToken.save();
  }

  async saveRefreshToken(user) {
    let refreshToken = await RefreshToken.findOne({ userId: user.id });
    if (refreshToken) {
      refreshToken.token = user.refreshToken;
    } else {
      refreshToken = RefreshToken.create();
      refreshToken.userId = user.id;
      refreshToken.token = user.refreshToken;
    }
    refreshToken.save();
  }

  protected async getRefreshToken(): Promise<{
    token: string;
    expiry: string;
  }> {
    const refresh = {
      token: randomToken.generate(32),
      expiry: dayjs().add(2, 'day').format('YYYY/MM/DD'),
    };
    return refresh;
  }
}
