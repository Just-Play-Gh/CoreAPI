export declare class BaseController {
    protected readonly service: any;
    private _dtos;
    private _permissions;
    constructor(service: any);
    set dtos(dtos: any);
    get dtos(): any;
    set permissions(permissions: any);
    get permissions(): any;
    getAll(query: any): Promise<any>;
    getByColumns(query: any): Promise<any>;
    getOne(param: any, query: any): Promise<any>;
    store(body: any, user: any): Promise<any>;
    update(createData: any, query: any, param: any, user: any): Promise<any>;
    delete(param: any): Promise<any>;
}
