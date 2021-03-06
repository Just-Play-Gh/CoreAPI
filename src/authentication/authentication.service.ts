import {
  ConflictException,
  HttpException,
  HttpStatus,
  Injectable,
  Logger,
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
import { userEntities } from '../types';
import { ChangePasswordDto } from './dto/change-password.dto';
import { LoginDto, LogoutDto, oauthLoginDto } from './dto/login.dto';
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
import { RoleService } from '../role/role.service';
import { Otp } from '../otp/entity/otp.entity';
import { OAuth2Client } from 'google-auth-library';
import jwt from 'jsonwebtoken';
import {
  ForgotPasswordWithEmail,
  ForgotPasswordWithOtp,
} from './dto/forgot-password.dto';
import { StatusType } from 'src/driver/entities/driver.entity';
import { Role } from 'src/role/entity/role.entity';

@Injectable()
export class AuthenticationService {
  private userRoles = ['superuser', 'support'];
  constructor(
    private jwtService: JwtService,
    private readonly notificationService: NotificationService,
    private readonly roleService: RoleService,
  ) {}

  async login(body, queries, res: Response) {
    try {
      const { contain } = queries;
      const { phoneNumber, country, userType, password } = body;
      const validDto = await validateDto(new LoginDto(), body);
      if (Object.keys(validDto).length > 0)
        throw new HttpException(validDto, HttpStatus.BAD_REQUEST);
      // Parse phone number to international standard
      const parsePhone = parsePhoneNumber(
        phoneNumber,
        country as CountryCode,
      ).number.substring(1);
      const relations = contain?.split(',');
      const user = await userEntities[userType].findOne(
        {
          phoneNumber: String(parsePhone),
          status: StatusType.Active,
        },
        { relations },
      );

      if (!user || !(await user?.validatePassword(password)))
        throw new UnauthorizedException();
      // Fetch user role and permissions
      // const role = await this.roleService.getByColumns({
      //   columns: `alias:${userType}`,
      //   contain: 'permissions',
      // });
      // if (role.length > 0) user['role'] = role[0];
      if (user.status === 'inactive' || user.status === 'disable') {
        Logger.log('User is inactive. Login failed :', phoneNumber);
        throw new UnauthorizedException(
          'Sorry you cannot login at this time because your account is inactive. kindly reach out to support@fuelup.com if this persists.',
        );
      }
      Logger.log('Login Successful', phoneNumber);
      user['userType'] = userType;
      return this.generateToken(user, res);
    } catch (error) {
      Logger.error(error);
      throw error;
    }
  }

  async oauthLogin(body: oauthLoginDto, queries, res: Response) {
    Logger.log('OAUTH login');
    const audienceIdType: { [type: string]: string } = {
      web: process.env.GOOGLE_CLIENT_ID,
      expo: process.env.GOOGLE_EXPO_CLIENT_ID,
      ios: process.env.GOOGLE_IOS_CLIENT_ID,
      android: process.env.GOOGLE_ANDROID_CLIENT_ID,
    };
    Logger.log('OAUTH login Initiated');
    const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
    try {
      const validDto = await validateDto(new oauthLoginDto(), body);
      if (Object.keys(validDto).length > 0)
        throw new HttpException(validDto, HttpStatus.BAD_REQUEST);
      Logger.log('After valid dto');
      await client.verifyIdToken({
        idToken: body.idToken,
        audience: audienceIdType[queries.platform],
      });
      const oauthUser = jwt.decode(body.idToken) as any;
      body.email = oauthUser.email;
      const { userType, email } = body;
      const findUser = await userEntities[userType].findOne({
        email,
        status: StatusType.Active,
      });
      if (!findUser) {
        // When user not found, check if userType is not a backoffice user
        if (userType !== 'user') {
          const user = userEntities[userType].create();
          user.firstName = oauthUser.given_name;
          user.lastName = oauthUser.family_name;
          user.email = oauthUser.email;
          user.provider = queries.platform !== 'web' ? queries.provider : null;
          const addedUser = await userEntities[userType].save(user);
          user['userType'] = userType;
          return this.generateToken(addedUser, res);
        }
        Logger.log('401 unauthenticated check,,', JSON.stringify(findUser));
        throw new UnauthorizedException();
      }
      console.log('the found user', findUser);
      Logger.log('User login successfully :', findUser);
      findUser['userType'] = userType !== 'user' ? userType : findUser.role;
      return this.generateToken(findUser, res);
    } catch (error) {
      console.log(error);
      throw new UnauthorizedException();
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

  async registerCustomerSendOtp(body: SendOtpDto) {
    try {
      const validDto = await validateDto(new SendOtpDto(), body);
      if (Object.keys(validDto).length > 0)
        throw new HttpException(validDto, HttpStatus.BAD_REQUEST);
      const { phoneNumber, country, userType, requestType, email } = body;
      const parsePhone = parsePhoneNumber(
        phoneNumber,
        (country ?? 'GH') as CountryCode,
      ).number.substring(1);
      console.log('Register User Phone number: ', parsePhone);
      // Check if user exists for sign up before sending otp
      if (requestType === 'signup') {
        const userExists = await this.findUser(userType, parsePhone, email);
        if (userExists) {
          Logger.log('User already exists');
          throw new ConflictException(
            `A user already exists with this email or phone number`,
          );
        }
      }

      // Generate otp
      const otp = generateOtp(4);
      console.log('OTP: ', otp);
      // Save otp
      await this.saveOtp(parsePhone, otp, userType);
      // Send otp as sms
      const message = `Your OTP for FuelUp is : ${otp}`;
      await this.notificationService.sendSMS(parsePhone, message);
      return { message: 'OTP successful sent' };
    } catch (error) {
      throw error;
    }
  }

  async verifyOtp(body) {
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
      if (body.deleteOtp) {
        await Otp.delete({ phoneNumber: parsePhone });
      }
      return { message: 'OTP successful verified' };
    } catch (error) {
      Logger.error(error);
      throw error;
    }
  }

  async registerCustomer(body, res: Response) {
    try {
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
      Logger.log('User already exists');
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
    const role = await this.roleService.roleByAlias(userType);
    if (userType === 'driver' || 'customer')
      user.roleId = role ? role.id : null;
    user.password = password ?? generatePassword(6);
    user.country = country;
    user.phoneNumber = parsePhone;
    user.status = StatusType.Active;
    const passwordToSend = user.password;
    await userEntities[userType].save(user);
    if (userType === 'driver') {
      this.notificationService.sendSMS(
        user.phoneNumber,
        `Your temp password is:${passwordToSend}`,
      );
    }
    Logger.log('User created successfully');
    user['userType'] = userType;
    return this.generateToken(user, res);
  }

  async registerOauthUser(body, res: Response) {
    // Destruct register body
    const { userType, email } = body;
    const user = userEntities[userType].create();
    const userExists = await this.findUser(userType, email);
    if (userExists) {
      Logger.log('User already exists');
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
    user.emailVerifiedAt = new Date();
    user.status = StatusType.Active;
    await userEntities[userType].save(user);
    Logger.log('User created successfully');
    user['userType'] = userType;
    return this.generateToken(user, res);
  }

  async sendForgotPasswordOtp(body) {
    try {
      const validDto = await validateDto(new ForgotPasswordWithOtp(), body);
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
      console.log('OTP: ', otp);
      // Save otp
      await this.saveOtp(parsePhone, otp, userType);
      // Send otp as sms
      await this.notificationService.sendSMS(parsePhone, otp);
      return { message: 'OTP successfully sent' };
    } catch (error) {
      throw error;
    }
  }

  async sendForgotPasswordEmail(body) {
    try {
      const validDto = await validateDto(new ForgotPasswordWithEmail(), body);
      if (Object.keys(validDto).length > 0)
        throw new HttpException(validDto, HttpStatus.BAD_REQUEST);
      const { userType, email } = body;
      const user = await this.findUser(userType, null, email);
      if (!user) throw new NotFoundException('User account not found');
      // Generate otp
      const otp = generateOtp(9);
      console.log('OTP: ', otp);
      // Save otp
      await this.saveOtp(user.phoneNumber, otp, userType);
      // Send forgot password email
      await this.notificationService.sendForgotPasswordEmail(user, otp);
      return { message: 'Email successfully sent' };
    } catch (error) {
      throw error;
    }
  }

  async resetPasswordWithOtp(body) {
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
      Logger.error(error);
      throw error;
    }
  }

  async resetPasswordWithEmail(body) {
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
      Logger.error(error);
      throw error;
    }
  }

  async changePassword(body: ChangePasswordDto, userContext, res: Response) {
    try {
      const validDto = await validateDto(new ChangePasswordDto(), body);
      if (Object.keys(validDto).length > 0)
        throw new HttpException(validDto, HttpStatus.BAD_REQUEST);
      const { userType, currentPassword, newPassword } = body;
      const user = await userEntities[userType].findOne({ id: userContext.id });
      if (!user || !user.validatePassword(currentPassword))
        throw new HttpException('Invalid Password', HttpStatus.BAD_REQUEST);
      user.password = newPassword;
      if (userType === 'driver') user['verifiedAt'] = new Date();
      await userEntities[userType].save(user);
      if (body.firstTimer) {
        user['userType'] = userType;
        return this.generateToken(user, res);
      }
      return { message: 'Password changed successful' };
    } catch (error) {
      Logger.error(error);
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
    return secretData;
    // return { message: 'Refresh successful' };
  }

  async saveOtp(phoneNumber, otp, userType) {
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
    passwordReset['userType'] = userType;
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
    const role = await Role.findOne({
      where: { alias: user.userType },
    });
    const payload = {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      phoneNumber: user.phoneNumber,
      profileImage: user.profileImage,
      role: role ? JSON.stringify(role) : null,
    };

    if (user.truck) {
      payload['truck'] = user.truck;
    }
    user['accessToken'] = this.jwtService.sign(payload);
    const secretData = {
      token: user.accessToken,
      refreshToken: await this.getRefreshToken(),
    };
    res.cookie('auth-cookie', secretData, { httpOnly: true });
    user['refreshToken'] = secretData.refreshToken.token;
    delete user.password;
    delete user.hidden;
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

  async logout(logoutDto: LogoutDto) {
    await AccessToken.delete({ userId: logoutDto.userId });
    return { message: 'Logout Successful' };
  }
}
