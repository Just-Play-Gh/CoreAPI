import {
  Body,
  Controller,
  Get,
  Logger,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Invoice } from './entities/invoice.entity';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { InvoiceService } from './invoice.service';
import { CurrentUser } from '../decorators/current-user.decorator';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { UpdateInvoiceDto } from './dto/update-invoice.dto';
import { Request } from 'express';
import { Customer } from '../customer/entities/customer.entity';
import { Driver } from '../driver/entities/driver.entity';
import { PermissionGuard } from 'src/guards/permission-guard';

@Controller('invoices')
export class InvoiceController {
  constructor(private readonly invoiceService: InvoiceService) {}

  @UseGuards(JwtAuthGuard)
  // @UseGuards(JwtAuthGuard, PermissionGuard)
  @Post()
  async createInvoice(
    @Body() createInvoiceDto: CreateInvoiceDto,
    @CurrentUser() user: Driver | Customer,
  ): Promise<Invoice> {
    Logger.log('creating invoice...', createInvoiceDto);
    return this.invoiceService.createInvoice(createInvoiceDto, user);
  }

  @UseGuards(JwtAuthGuard)
  // @UseGuards(JwtAuthGuard, PermissionGuard)
  @Patch(':id')
  async updateInvoice(
    @Body() updateInvoiceDto: UpdateInvoiceDto,
    @Req() req: Request,
  ): Promise<Invoice> {
    Logger.log('updating invoice...', updateInvoiceDto);
    return this.invoiceService.updateInvoice(
      { ...updateInvoiceDto, invoiceId: +req.params.id },
      req.user as Driver | Customer,
    );
  }
}
