import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { GetProductDto } from './dto/get-product.dto';
import { Product } from './entities/product.entity';

@Injectable()
export class ProductService {
  async getProduct(getProductDto: GetProductDto): Promise<Product> {
    const { id } = getProductDto;
    const product = await Product.findOne(id);
    if (!product)
      throw new HttpException('Product Not Found', HttpStatus.NOT_FOUND);
    return product;
  }

  async getProducts(): Promise<Product[]> {
    return await Product.find();
  }
}
