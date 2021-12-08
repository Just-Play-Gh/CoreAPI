import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CurrentUser } from 'src/customer/customer.decorator';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { userEntities } from 'src/types';
import { AuthenticationService } from './authentication.service';

@Controller('auth')
export class AuthenticationController {
  constructor(private authService: AuthenticationService) {}
  @Post('/login')
  async login(@Body() loginDto, @Query() queries) {
    const { userType } = loginDto;
    if (!userType || !(userType in userEntities))
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    return this.authService.login(loginDto, queries);
  }

  @Post('/register-driver')
  async registerDriver(@Body() registerDto) {
    const { userType } = registerDto;
    if (!userType || !(userType in userEntities))
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    return this.authService.registerDriver(registerDto);
  }

  @Post('/send-top')
  async registerCustomerSendOtp(@Body() registerSendOtpDto) {
    const { userType } = registerSendOtpDto;
    if (!userType || !(userType in userEntities))
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    return this.authService.registerCustomerSendOtp(registerSendOtpDto);
  }

  @Post('/verify-top')
  async registerCustomerVerifyOtp(@Body() registerVerifyOtpDto) {
    const { userType } = registerVerifyOtpDto;
    if (!userType || !(userType in userEntities))
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    return this.authService.registerCustomerVerifyOtp(registerVerifyOtpDto);
  }

  @Post('/register-customer')
  async registerCustomer(@Body() registerDto) {
    const { userType } = registerDto;
    if (!userType || !(userType in userEntities))
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    return this.authService.registerCustomer(registerDto);
  }

  @Post('/forgot-password/sendOtp')
  async sendForgotPasswordEmal(@Body() registerDto) {
    const { userType } = registerDto;
    if (!userType || !(userType in userEntities))
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    return this.authService.sendForgotPasswordOtp(registerDto);
  }

  @Post('/forgot-password/sendEmail')
  async sendForgotPasswordEmail(@Body() registerDto) {
    const { userType } = registerDto;
    if (!userType || !(userType in userEntities))
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    return this.authService.sendForgotPasswordEmail(registerDto);
  }

  @Post('/reset-password/otp')
  async resetOtpPassword(@Body() registerDto) {
    const { userType } = registerDto;
    if (!userType || !(userType in userEntities))
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    return this.authService.resetOtpPassword(registerDto);
  }

  @Post('/reset-password/email')
  async resetEmailPassword(@Body() registerDto) {
    const { userType } = registerDto;
    if (!userType || !(userType in userEntities))
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    return this.authService.resetEmailPassword(registerDto);
  }

  @UseGuards(JwtAuthGuard)
  @Post('/change-password')
  async changePassword(@Body() registerDto, @CurrentUser() userContext) {
    const { userType } = registerDto;
    if (!userType || !(userType in userEntities))
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    console.log(userContext);
    return this.authService.changePassword(registerDto, userContext);
  }
}
