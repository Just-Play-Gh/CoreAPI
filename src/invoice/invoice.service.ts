import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { User } from 'src/customer/user/entities/user.entity';
import { ProductService } from 'src/product/product.service';
import { CreateInvoiceDto } from './dto/create-product.dto';
import { Invoice } from './entities/invoice.entity';

@Injectable()
export class InvoiceService {
  constructor(private readonly productService: ProductService) {}

  async createInvoice(
    createInvoiceDto: CreateInvoiceDto,
    user: User,
  ): Promise<Invoice> {
    const { productId } = createInvoiceDto;
    const { firstName, lastName, phoneNumber } = user;
    const product = await this.productService.getProduct({ id: productId });
    if (!product)
      throw new HttpException('Product Not Found', HttpStatus.NOT_FOUND);
    const invoice = Invoice.create();
    invoice.invoiceNumber = new Date().toISOString().replace(/\D/g, '');
    invoice.customerFullName = `${firstName} ${lastName}`;
    invoice.customerPhoneNumber = phoneNumber;
    invoice.pricePerLitre = await product.pricePerLitre;
    invoice.taxes = product.taxes;
    console.log('the things', invoice, product);
    // invoice.totalAmount = +product.pricePerLitre * product.pricePerLitre;
    await Invoice.save(invoice);
    return invoice;
  }
}
