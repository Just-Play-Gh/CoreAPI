import { Controller, Get, Param, Post } from '@nestjs/common';
import { Product } from './entities/product.entity';
import { ProductService } from './product.service';

@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}
  @Get(':id')
  async getProduct(@Param() id: number): Promise<Product> {
    return this.productService.getProduct({ id: Number(id) });
  }

  @Get()
  async getProducts(): Promise<Product[]> {
    return this.productService.getProducts();
  }
}
