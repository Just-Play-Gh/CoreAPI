import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import {
  IPaginationOptions,
  paginate,
  Pagination,
} from 'nestjs-typeorm-paginate';
import { createQueryBuilder } from 'typeorm';
import { GetProductDto } from './dto/get-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
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

  async paginate(
    options: IPaginationOptions,
    searchParams = {},
  ): Promise<Pagination<Product>> {
    let productRepository;
    if (searchParams) {
      productRepository = createQueryBuilder(Product)
        .where(searchParams)
        .withDeleted();
    } else {
      productRepository = createQueryBuilder(Product).withDeleted();
    }
    const products = await paginate<Product>(productRepository, options);
    if (!products['items'])
      throw new HttpException('No products were found', HttpStatus.NOT_FOUND);
    return products;
  }

  async update(id: number, updateProductDto: UpdateProductDto) {
    const product = await Product.findOne(id);
    if (!product)
      throw new HttpException('Product Not Found', HttpStatus.NOT_FOUND);
    const { description, pricePerLitre } = updateProductDto;
    product.description = description;
    product.pricePerLitre = pricePerLitre;
    product.save();
    return product;
  }
  async remove(id: number) {
    const product = await Product.findOne(id);
    if (!product)
      throw new HttpException('Product Not Found', HttpStatus.NOT_FOUND);
    const result = product.softRemove();
    console.log(result);
    return result;
  }
}
