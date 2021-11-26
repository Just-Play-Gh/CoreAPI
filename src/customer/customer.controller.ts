import { Body, Controller, Patch, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { ChangePasswordDto } from './dto/change-password.dto';
import { Customer } from './entities/customer.entity';
import { CurrentUser } from './customer.decorator';
import { CustomerService } from './customer.service';

@Controller('customers')
export class CustomerController {
  constructor(private readonly customerService: CustomerService) {}

  @UseGuards(JwtAuthGuard)
  @Patch('/change-password')
  async changePassword(
    @Body() changePassword: ChangePasswordDto,
    @CurrentUser() customer: Customer,
  ): Promise<{ message: string }> {
    return this.customerService.changePassword(changePassword, customer);
  }
}
