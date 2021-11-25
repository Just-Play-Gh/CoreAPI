import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { Invoice } from './entities/invoice.entity';
import { CreateInvoiceDto } from './dto/create-product.dto';
import { InvoiceService } from './invoice.service';
import { CurrentUser } from 'src/customer/user/user.decorator';
import { User } from 'src/customer/user/entities/user.entity';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';

@Controller('invoices')
export class InvoiceController {
  constructor(private readonly invoiceService: InvoiceService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async createInvoice(
    @Body() invoiceDto: CreateInvoiceDto,
    @CurrentUser() user: User,
  ): Promise<Invoice> {
    return this.invoiceService.createInvoice(invoiceDto, user);
  }
}
