import { CustomerService } from './customer.service';
import { BaseController } from '../resources/base.controller';
import { Customer } from './entities/customer.entity';
export declare class CustomerController extends BaseController {
    private readonly customerService;
    constructor(customerService: CustomerService);
    oauthLogin(updateProfileDto: any, user: Customer): Promise<Customer>;
}
