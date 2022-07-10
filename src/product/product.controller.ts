import {
  Controller,
  DefaultValuePipe,
  Get,
  ParseIntPipe,
  Query,
  UseGuards,
} from '@nestjs/common';
import { PermissionGuard } from 'src/guards/permission-guard';
import { SearchUserDto } from 'src/users/dto/search-user.dto';
import { Like } from 'typeorm';
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

  @Get('/management/all')
  findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page = 1,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit = 10,
    @Query() getProducts: SearchUserDto,
  ) {
    delete getProducts.page;
    delete getProducts.limit;
    let searchParams = {};

    if (getProducts.searchField) {
      searchParams = [
        {
          // [getProducts.searchField]: getProducts.searchValue,
          name: Like('%' + getProducts.searchValue + '%'),
        },
      ];
    }
    return this.productService.paginate({ page, limit }, searchParams);
  }
  @Get()
  @UseGuards(JwtAuthGuard)
  // @UseGuards(JwtAuthGuard, PermissionGuard)
  async getAll(@Query() query) {
    try {
      return this.productService.getProducts(query);
    } catch (error) {
      console.log(error);
    }
  }
}
