import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { PermissionGuard } from 'src/guards/permission-guard';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { BaseController } from '../resources/base.controller';
import { CreateProductDto } from './dto/create-product.dto';
import { ProductService } from './product.service';

@Controller('products')
export class ProductController extends BaseController {
  constructor(private readonly productService: ProductService) {
    super(productService);
    this.dtos = { store: CreateProductDto };
  }

  @Get()
  @UseGuards(JwtAuthGuard, PermissionGuard)
  async getAll(@Query() query) {
    try {
      return this.productService.getProducts(query);
    } catch (error) {
      console.log(error);
    }
  }
}
