import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Customer } from 'src/customer/entities/customer.entity';
import { Driver } from 'src/driver/entities/driver.entity';
import { ProductService } from 'src/product/product.service';
import { TaxType } from 'src/tax/entities/tax.entity';
import { SaveOptions } from 'typeorm';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { GetInvoiceDto } from './dto/get-invoice.dto';
import { UpdateInvoiceDto } from './dto/update-invoice.dto';
import { Invoice } from './entities/invoice.entity';

@Injectable()
export class InvoiceService {
  constructor(private readonly productService: ProductService) {}

  async createInvoice(
    createInvoiceDto: CreateInvoiceDto,
    user: Customer | Driver,
  ): Promise<Invoice> {
    const { productId, amount } = createInvoiceDto;
    const { firstName, lastName, phoneNumber } = user;
    const product = await this.productService.getProduct({ id: productId });
    if (!product)
      throw new HttpException('Product Not Found', HttpStatus.NOT_FOUND);
    const invoice = Invoice.create();
    invoice.invoiceNumber = new Date().toISOString().replace(/\D/g, '');
    invoice.customerFullName = `${firstName} ${lastName}`;
    invoice.customerPhoneNumber = phoneNumber;
    invoice.pricePerLitre = await product.pricePerLitre;
    // DO NOT DELETE THE LINE BELOW
    // const totalTaxes = product.taxes
    //   .map((tax) => {
    //     const value =
    //       tax.type === TaxType.Fixed
    //         ? tax.value
    //         : (createInvoiceDto.amount * tax.value) / 100;
    //     return value;
    //   })
    //   .reduce((prevTax, currentTax) => {
    //     return prevTax + currentTax;
    //   }, 0);
    // invoice.taxes = parseInt(totalTaxes.toString()).toFixed(2);
    invoice.taxes = product.taxes;
    invoice.totalAmount = amount;
    await Invoice.save(invoice);
    return invoice;
  }

  async updateInvoice(
    updateInvoiceDto: UpdateInvoiceDto,
    user: Customer | Driver,
  ): Promise<Invoice> {
    const { invoiceId } = updateInvoiceDto;
    try {
      return await (
        await this.getInvoice({ invoiceId })
      ).save(updateInvoiceDto as SaveOptions);
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async getInvoice(getInvoiceDto: GetInvoiceDto): Promise<Invoice> {
    const { invoiceId } = getInvoiceDto;
    const invoice = await Invoice.findOne({ id: invoiceId });
    if (!invoice)
      throw new HttpException('Invoice Not Found', HttpStatus.NOT_FOUND);
    return invoice;
  }
}
