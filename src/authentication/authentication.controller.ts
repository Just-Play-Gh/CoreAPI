import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Post,
  Query,
  Req,
  Res,
  UseGuards,
  Logger,
} from '@nestjs/common';
import { Response } from 'express';
import { CurrentUser } from '../decorators/current-user.decorator';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { RefreshTokenGuard } from '../guards/refresh-token.guard';
import { userEntities } from '../types';
import { AuthenticationService } from './authentication.service';
import { ChangePasswordDto } from './dto/change-password.dto';
import {
  ForgotPasswordWithEmail,
  ForgotPasswordWithOtp,
} from './dto/forgot-password.dto';
import { LogoutDto } from './dto/login.dto';
import {
  ResetPasswordEmailDto,
  ResetPasswordOtpDto,
} from './dto/reset-password.dto';

@Controller('auth')
export class AuthenticationController {
  constructor(private authService: AuthenticationService) {}
  @Post('/login')
  async login(
    @Res({ passthrough: true }) res: Response,
    @Body() loginDto,
    @Query() queries,
  ) {
    const { userType, phoneNumber, email } = loginDto;
    Logger.log('User trying to login...', {
      phoneNumber: phoneNumber,
      email: email,
    });
    if (!userType || !(userType in userEntities))
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    res.status(200);
    return this.authService.login(loginDto, queries, res);
  }

  @Post('/oauth-login')
  async oauthLogin(
    @Res({ passthrough: true }) res: Response,
    @Body() loginDto,
    @Query() queries,
  ) {
    console.log('hit');
    Logger.log('User trying to login...', {
      email: loginDto.email,
    });
    // res.status(200);
    return this.authService.oauthLogin(loginDto, queries, res);
  }

  @Post('/register-driver')
  async registerDriver(@Body() registerDto, @Res({ passthrough: true }) res) {
    registerDto['userType'] = 'driver';
    const { userType, phoneNumber } = registerDto;
    Logger.log('Driver trying to login...', phoneNumber);
    if (!userType || !(userType in userEntities))
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    return this.authService.registerDriver(registerDto, res);
  }

  @Post('/send-otp')
  async registerCustomerSendOtp(@Body() registerSendOtpDto) {
    const { userType, phoneNumber } = registerSendOtpDto;
    Logger.log('Sending OTP to: ', phoneNumber);
    if (!userType || !(userType in userEntities))
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    return this.authService.registerCustomerSendOtp(registerSendOtpDto);
  }

  @Post('/verify-otp')
  async verifyOtp(@Body() verifyOtpDto) {
    const { userType } = verifyOtpDto;
    Logger.log('verifying otp');
    if (!userType || !(userType in userEntities))
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    return this.authService.verifyOtp(verifyOtpDto);
  }

  @Post('/register-customer')
  async registerCustomer(@Body() registerDto, @Res({ passthrough: true }) res) {
    registerDto['userType'] = 'customer';
    const { userType, phoneNumber } = registerDto;
    Logger.log('customer registration started...', phoneNumber);
    if (!userType || !(userType in userEntities))
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    return this.authService.registerCustomer(registerDto, res);
  }

  @Post('/forgot-password/sendOtp')
  async sendForgotPasswordEmal(
    @Body() forgotPasswordDto: ForgotPasswordWithOtp,
  ) {
    const { userType } = forgotPasswordDto;
    Logger.log('sending reset password OTP');
    if (!userType || !(userType in userEntities))
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    return this.authService.sendForgotPasswordOtp(forgotPasswordDto);
  }

  @Post('/forgot-password/sendEmail')
  async sendForgotPasswordEmail(
    @Body() forgotPassword: ForgotPasswordWithEmail,
  ) {
    Logger.log('sending reset password Email');
    const { userType } = forgotPassword;
    if (!userType || !(userType in userEntities))
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    return this.authService.sendForgotPasswordEmail(forgotPassword);
  }

  @Post('/reset-password/otp')
  async resetPasswordWithOtp(@Body() resetPassword: ResetPasswordOtpDto) {
    Logger.log('Reset password OTP');
    const { userType } = resetPassword;
    if (!userType || !(userType in userEntities))
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    return this.authService.resetPasswordWithOtp(resetPassword);
  }

  @Post('/reset-password/email')
  async resetPasswordWithEmail(@Body() resetPassword: ResetPasswordEmailDto) {
    const { userType } = resetPassword;
    if (!userType || !(userType in userEntities))
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    return this.authService.resetPasswordWithEmail(resetPassword);
  }

  @UseGuards(JwtAuthGuard)
  @Post('/change-password')
  async changePassword(
    @Body() changePasswordDto: ChangePasswordDto,
    @CurrentUser() userContext,
    @Res({ passthrough: true }) res: Response,
  ) {
    Logger.log('Changing password...');
    const { userType } = changePasswordDto;
    if (!userType || !(userType in userEntities))
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    return this.authService.changePassword(changePasswordDto, userContext, res);
  }

  @UseGuards(RefreshTokenGuard)
  @Post('/refresh-token')
  async refreshToken(
    @CurrentUser() userContext,
    @Res({ passthrough: true }) res,
    @Req() req,
  ) {
    return this.authService.refreshToken(userContext, req, res);
  }

  @UseGuards(JwtAuthGuard)
  @Post('/logout')
  async Logout(@Body() logoutDto: LogoutDto) {
    Logger.log('Logging out...');
    return this.authService.logout(logoutDto);
  }
}
