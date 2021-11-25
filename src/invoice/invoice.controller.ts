import { Body, Controller, Post } from '@nestjs/common';
import { Invoice } from './entities/invoice.entity';
import { CreateInvoiceDto } from './dto/create-product.dto';
import { InvoiceService } from './invoice.service';
import { CurrentUser } from 'src/customer/user/user.decorator';
import { User } from 'src/customer/user/entities/user.entity';

@Controller('invoices')
export class InvoiceController {
  constructor(private readonly invoiceService: InvoiceService) {}

  @Post()
  async createInvoice(
    @Body() invoiceDto: CreateInvoiceDto,
    @CurrentUser() user: User,
  ): Promise<Invoice> {
    return this.invoiceService.createInvoice(invoiceDto, user);
  }
}
