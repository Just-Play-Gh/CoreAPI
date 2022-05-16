import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Logger,
  Patch,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CustomerService } from './customer.service';
import { BaseController } from '../resources/base.controller';
import { CurrentUser } from 'src/decorators/current-user.decorator';
import { Customer } from './entities/customer.entity';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { PermissionGuard } from 'src/guards/permission-guard';
import { AuthenticationService } from 'src/authentication/authentication.service';
import { UpdateCustomerDto } from './dto/update-customer.dto';

@Controller('customers')
export class CustomerController extends BaseController {
  constructor(
    private readonly customerService: CustomerService,
    private readonly authenticationService: AuthenticationService,
  ) {
    super(customerService);
  }

  @Patch('/update-profile')
  @UseGuards(JwtAuthGuard)
  async updateProfile(
    @Body() updateProfileDto: UpdateCustomerDto,
    @CurrentUser() user: Customer,
  ) {
    Logger.log('Customer updating profile', JSON.stringify(updateProfileDto));
    if (updateProfileDto.phoneNumber) {
      try {
        const res = this.authenticationService.verifyOtp({
          country: updateProfileDto.country,
          phoneNumber: updateProfileDto.phoneNumber,
          otp: updateProfileDto.otp,
        });
        if (res) {
          updateProfileDto.phoneNumberVerifiedAt = new Date();
        } else {
          Logger.log('Invalid otp', res);
          throw new HttpException(
            'Please ensure that the OTP entered is valid',
            HttpStatus.BAD_REQUEST,
          );
        }
        return this.customerService.updateProfileDto(updateProfileDto, user);
      } catch (error) {
        throw new HttpException(
          'Please ensure that the OTP entered is valid',
          HttpStatus.BAD_REQUEST,
        );
      }
    }
    return this.customerService.updateProfileDto(updateProfileDto, user);
  }

  @Get('/search')
  @UseGuards(JwtAuthGuard)
  async searchCustomer(@Query() params) {
    return await this.customerService.search(params);
  }
}
