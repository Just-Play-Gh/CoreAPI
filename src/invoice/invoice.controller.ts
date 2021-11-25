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
import { CurrentUser } from 'src/customer/user/user.decorator';
import { User } from 'src/customer/user/entities/user.entity';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { UpdateInvoiceDto } from './dto/update-invoice.dto';
import { Request } from 'express';

@Controller('invoices')
export class InvoiceController {
  constructor(private readonly invoiceService: InvoiceService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async createInvoice(
    @Body() createInvoiceDto: CreateInvoiceDto,
    @CurrentUser() user: User,
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
      req.user as User,
    );
  }
}
