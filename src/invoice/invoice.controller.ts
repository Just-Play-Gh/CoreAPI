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
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { UpdateInvoiceDto } from './dto/update-invoice.dto';
import { Request } from 'express';
import { Customer } from 'src/customer/entities/customer.entity';
import { Driver } from 'src/driver/entities/driver.entity';
import { CurrentUser } from 'src/decorators/current-user.decorator';

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
