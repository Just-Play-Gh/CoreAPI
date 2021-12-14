import { Module } from '@nestjs/common';
import { RoleModule } from 'src/role/role.module';
import { RoleService } from 'src/role/role.service';
import { SharedModule } from 'src/shared/shared.module';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';

@Module({
  imports: [SharedModule],
  exports: [ProductService],
  controllers: [ProductController],
  providers: [ProductService],
})
export class ProductModule {}
