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
import { CurrentUser } from 'src/customer/customer.decorator';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { RefreshTokenGuard } from 'src/guards/refresh-token.guard';
import { userEntities } from 'src/types';
import { AuthenticationService } from './authentication.service';

@Controller('auth')
export class AuthenticationController {
  constructor(private authService: AuthenticationService) {}
  @Post('/login')
  async login(
    @Res({ passthrough: true }) res,
    @Body() loginDto,
    @Query() queries,
  ) {
    const { userType } = loginDto;
    if (!userType || !(userType in userEntities))
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    return this.authService.login(loginDto, queries, res);
  }

  @Post('/register-driver')
  async registerDriver(@Body() registerDto, @Res({ passthrough: true }) res) {
    const { userType } = registerDto;
    if (!userType || !(userType in userEntities))
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    return this.authService.registerDriver(registerDto, res);
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
  async registerCustomer(@Body() registerDto, @Res({ passthrough: true }) res) {
    const { userType } = registerDto;
    if (!userType || !(userType in userEntities))
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    return this.authService.registerCustomer(registerDto, res);
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
