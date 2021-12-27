import { Customer } from '../customer/entities/customer.entity';
import { Driver } from '../driver/entities/driver.entity';
import { ProductService } from '../product/product.service';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { GetInvoiceDto } from './dto/get-invoice.dto';
import { UpdateInvoiceDto } from './dto/update-invoice.dto';
import { Invoice } from './entities/invoice.entity';
export declare class InvoiceService {
    private readonly productService;
    constructor(productService: ProductService);
    createInvoice(createInvoiceDto: CreateInvoiceDto, user: Customer | Driver): Promise<Invoice>;
    updateInvoice(updateInvoiceDto: UpdateInvoiceDto, user: Customer | Driver): Promise<Invoice>;
    getInvoice(getInvoiceDto: GetInvoiceDto): Promise<Invoice>;
}
