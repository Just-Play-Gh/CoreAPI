import { CustomerService } from './customer.service';
import { BaseController } from '../resources/base.controller';
export declare class CustomerController extends BaseController {
    private readonly customerService;
    constructor(customerService: CustomerService);
}
