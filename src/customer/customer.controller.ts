import {
  Body,
  Controller,
  Get,
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

@Controller('customers')
export class CustomerController extends BaseController {
  constructor(private readonly customerService: CustomerService) {
    super(customerService);
  }

  @Patch('/update-profile')
  @UseGuards(JwtAuthGuard, PermissionGuard)
  async oauthLogin(@Body() updateProfileDto, @CurrentUser() user: Customer) {
    Logger.log('Customer updating profile', updateProfileDto);
    return this.customerService.updateProfileDto(updateProfileDto, user);
  }

  @Get('/search')
  @UseGuards(JwtAuthGuard, PermissionGuard)
  async searchCustomer(@Query() params) {
    return await this.customerService.search(params);
  }
}
