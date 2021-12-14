import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { BaseController } from '../resources/base.controller';
import { ProductService } from './product.service';

@Controller('products')
export class ProductController extends BaseController {
  constructor(private readonly productService: ProductService) {
    super(productService);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async getProducts(@Query() query) {
    try {
      return this.productService.getProducts(query);
    } catch (error) {
      console.log(error);
    }
  }
}
