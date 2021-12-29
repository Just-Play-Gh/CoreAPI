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
} from '@nestjs/common';
import { Response } from 'express';
import { CurrentUser } from '../decorators/current-user.decorator';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { RefreshTokenGuard } from '../guards/refresh-token.guard';
import { userEntities } from '../types';
import { AuthenticationService } from './authentication.service';
import {
  ForgotPasswordWithEmail,
  ForgotPasswordWithOtp,
} from './dto/forgot-password.dto';
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
    const { userType } = loginDto;
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
    res.status(200);
    return this.authService.oauthLogin(loginDto, queries, res);
  }

  @Post('/register-driver')
  async registerDriver(@Body() registerDto, @Res({ passthrough: true }) res) {
    registerDto['userType'] = 'driver';
    const { userType } = registerDto;
    if (!userType || !(userType in userEntities))
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    return this.authService.registerDriver(registerDto, res);
  }

  @Post('/send-otp')
  async registerCustomerSendOtp(@Body() registerSendOtpDto) {
    const { userType } = registerSendOtpDto;
    if (!userType || !(userType in userEntities))
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    return this.authService.registerCustomerSendOtp(registerSendOtpDto);
  }

  @Post('/verify-otp')
  async verifyOtp(@Body() verifyOtpDto) {
    const { userType } = verifyOtpDto;
    if (!userType || !(userType in userEntities))
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    return this.authService.verifyOtp(verifyOtpDto);
  }

  @Post('/register-customer')
  async registerCustomer(@Body() registerDto, @Res({ passthrough: true }) res) {
    registerDto['userType'] = 'customer';
    const { userType } = registerDto;
    if (!userType || !(userType in userEntities))
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    return this.authService.registerCustomer(registerDto, res);
  }

  @Post('/forgot-password/sendOtp')
  async sendForgotPasswordEmal(
    @Body() forgotPasswordDto: ForgotPasswordWithOtp,
  ) {
    const { userType } = forgotPasswordDto;
    if (!userType || !(userType in userEntities))
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    return this.authService.sendForgotPasswordOtp(forgotPasswordDto);
  }

  @Post('/forgot-password/sendEmail')
  async sendForgotPasswordEmail(
    @Body() forgotPassword: ForgotPasswordWithEmail,
  ) {
    const { userType } = forgotPassword;
    if (!userType || !(userType in userEntities))
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    return this.authService.sendForgotPasswordEmail(forgotPassword);
  }

  @Post('/reset-password/otp')
  async resetPasswordWithOtp(@Body() resetPassword: ResetPasswordOtpDto) {
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
  async changePassword(@Body() registerDto, @CurrentUser() userContext) {
    const { userType } = registerDto;
    if (!userType || !(userType in userEntities))
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    return this.authService.changePassword(registerDto, userContext);
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
}
