import { BaseController } from '../resources/base.controller';
import { ProductService } from './product.service';
export declare class ProductController extends BaseController {
    private readonly productService;
    constructor(productService: ProductService);
    getAll(query: any): Promise<import("nestjs-typeorm-paginate").Pagination<any, import("nestjs-typeorm-paginate").IPaginationMeta>>;
}
