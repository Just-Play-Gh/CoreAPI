import { Module } from '@nestjs/common';
import { InvoiceService } from './invoice.service';
import { InvoiceController } from './invoice.controller';
import { SharedModule } from '../shared/shared.module';
import { ProductModule } from '../product/product.module';
import { PermissionService } from 'src/permission/permission.service';

@Module({
  imports: [ProductModule],
  exports: [InvoiceService],
  providers: [InvoiceService, PermissionService],
  controllers: [InvoiceController],
})
export class InvoiceModule {}
