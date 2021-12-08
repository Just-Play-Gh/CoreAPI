import { Body, Controller, Patch, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { ChangePasswordDto } from './dto/change-password.dto';
import { Customer } from './entities/customer.entity';
import { CurrentUser } from './customer.decorator';
import { CustomerService } from './customer.service';
import { BaseController } from 'src/resources/base.controller';
import { UpdateCustomerDto } from './dto/update-customer.dto';

@Controller('customers')
export class CustomerController extends BaseController {
  constructor(private readonly customerService: CustomerService) {
    super(customerService);
    // this.dtos = { store: ChangePasswordDto };
  }
}
