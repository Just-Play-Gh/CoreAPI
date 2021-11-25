import { Controller, Get, Param } from '@nestjs/common';
import { GetProductDto } from './dto/get-product.dto';
import { Product } from './entities/product.entity';
import { ProductService } from './product.service';

@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}
  @Get(':id')
  async getProduct(@Param() getproductDto: GetProductDto): Promise<Product> {
    return this.productService.getProduct(getproductDto);
  }

  @Get()
  async getProducts(): Promise<Product[]> {
    return this.productService.getProducts();
  }
}
