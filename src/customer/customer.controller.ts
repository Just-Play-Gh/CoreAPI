import { Body, Controller, Patch, UseGuards } from '@nestjs/common';
import { CustomerService } from './customer.service';
import { BaseController } from '../resources/base.controller';
import { CurrentUser } from 'src/decorators/current-user.decorator';
import { Customer } from './entities/customer.entity';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';

@Controller('customers')
export class CustomerController extends BaseController {
  constructor(private readonly customerService: CustomerService) {
    super(customerService);
  }

  @Patch('/update-profile')
  @UseGuards(JwtAuthGuard)
  async oauthLogin(@Body() updateProfileDto, @CurrentUser() user: Customer) {
    return this.customerService.updateProfileDto(updateProfileDto, user);
  }
}
