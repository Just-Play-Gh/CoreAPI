import {
  Body,
  Controller,
  Get,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Invoice } from './entities/invoice.entity';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { InvoiceService } from './invoice.service';
import { CurrentUser } from '../customer/customer.decorator';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { UpdateInvoiceDto } from './dto/update-invoice.dto';
import { Request } from 'express';
import { Customer } from '../customer/entities/customer.entity';
import { Driver } from '../driver/entities/driver.entity';

@Controller('invoices')
export class InvoiceController {
  constructor(private readonly invoiceService: InvoiceService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async createInvoice(
    @Body() createInvoiceDto: CreateInvoiceDto,
    @CurrentUser() user: Driver | Customer,
  ): Promise<Invoice> {
    return this.invoiceService.createInvoice(createInvoiceDto, user);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async updateInvoice(
    @Body() updateInvoiceDto: UpdateInvoiceDto,
    @Req() req: Request,
  ): Promise<Invoice> {
    return this.invoiceService.updateInvoice(
      { ...updateInvoiceDto, invoiceId: +req.params.id },
      req.user as Driver | Customer,
    );
  }
}
