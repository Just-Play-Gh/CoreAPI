export declare class BaseService {
    protected readonly entity: any;
    constructor(entity: any);
    getAll(query: any): Promise<import("nestjs-typeorm-paginate").Pagination<any, import("nestjs-typeorm-paginate").IPaginationMeta>>;
    getOne(param: any, query: any): Promise<any>;
    getByColumns(query: any): Promise<any>;
    store(body: any, query: any, storeDto: any): Promise<any>;
    update(param: any, body: any, query: any, updateDto: any): Promise<any>;
    delete(param: any): Promise<any>;
    private prepareBuilder;
    private fetchByColumns;
    private includeContains;
    private applyOrderBy;
    validateBody(): Promise<void>;
    private getQueryBuilder;
}
