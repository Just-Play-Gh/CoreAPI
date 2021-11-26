import { Module } from '@nestjs/common';
import { InvoiceService } from './invoice.service';
import { InvoiceController } from './invoice.controller';
import { SharedModule } from 'src/shared/shared.module';
import { ProductModule } from 'src/product/product.module';

@Module({
  imports: [ProductModule],
  exports: [InvoiceService],
  providers: [InvoiceService],
  controllers: [InvoiceController],
})
export class InvoiceModule {}
