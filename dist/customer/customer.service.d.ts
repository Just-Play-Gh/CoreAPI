import { BaseService } from '../resources/base.service';
import { Customer } from './entities/customer.entity';
export declare class CustomerService extends BaseService {
    constructor();
    updateProfileDto(updateProfileDto: any, user: Customer): Promise<Customer>;
}
