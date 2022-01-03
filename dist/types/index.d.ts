import { User } from 'src/users/entities/user.entity';
import { Customer } from '../customer/entities/customer.entity';
import { Driver } from '../driver/entities/driver.entity';
export declare enum StatusType {
    Active = "1",
    Inactive = "0"
}
export declare const userEntities: {
    customer: typeof Customer;
    driver: typeof Driver;
    user: typeof User;
};
export declare type ResponseMessage = {
    message: string;
};
export declare type PermissionsType = {
    permissions: {
        getAll: string;
    };
};
