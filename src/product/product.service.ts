import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import {
  IPaginationOptions,
  paginate,
  Pagination,
} from 'nestjs-typeorm-paginate';
import { Query } from 'node-mocks-http';
import { BaseService } from '../resources/base.service';
import { createQueryBuilder } from 'typeorm';
import { Product } from './entities/product.entity';

@Injectable()
export class ProductService extends BaseService {
  constructor() {
    super(Product);
  }
  async getProducts(query: Query) {
    const result = this.getAll(query);
    const items = (await result).items.map((product) => {
      product.taxes = product.taxes.filter((item) => item.status);
      return product;
    });
    ((await result).items as any) = items;
    return await result;
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
}
