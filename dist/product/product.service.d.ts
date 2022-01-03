import { Pagination } from 'nestjs-typeorm-paginate';
import { Query } from 'node-mocks-http';
import { BaseService } from '../resources/base.service';
export declare class ProductService extends BaseService {
    constructor();
    getProducts(query: Query): Promise<Pagination<any, import("nestjs-typeorm-paginate").IPaginationMeta>>;
}
