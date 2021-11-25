import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { product } from 'src/test.utility';
import { GetProductDto } from './dto/get-product.dto';
import { Product } from './entities/product.entity';

@Injectable()
export class ProductService {
  async getProduct(getProductDto: GetProductDto): Promise<Product> {
    const { id } = getProductDto;
    const product = await Product.findOne({
      relations: ['taxes'],
      where: { id, status: true },
    });

    if (!product)
      throw new HttpException('Product Not Found', HttpStatus.NOT_FOUND);
    product.taxes = product.taxes.filter((item) => item.status);
    return product;
  }

  async getProducts(): Promise<Product[]> {
    const products = await Product.find({
      relations: ['taxes'],
      where: { status: true },
    });
    return products.map((product) => {
      product.taxes = product.taxes.filter((item) => item.status);
      return product;
    });
  }
}
