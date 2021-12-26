import { Invoice } from './entities/invoice.entity';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { InvoiceService } from './invoice.service';
import { UpdateInvoiceDto } from './dto/update-invoice.dto';
import { Request } from 'express';
import { Customer } from '../customer/entities/customer.entity';
import { Driver } from '../driver/entities/driver.entity';
export declare class InvoiceController {
    private readonly invoiceService;
    constructor(invoiceService: InvoiceService);
    createInvoice(createInvoiceDto: CreateInvoiceDto, user: Driver | Customer): Promise<Invoice>;
    updateInvoice(updateInvoiceDto: UpdateInvoiceDto, req: Request): Promise<Invoice>;
}
