import { Customer } from '../customer/entities/customer.entity';
import { Driver } from '../driver/entities/driver.entity';

export enum StatusType {
  Active = '1',
  Inactive = '0',
}

export const userEntities = {
  customer: Customer,
  driver: Driver,
};

export type ResponseMessage = {
  message: string;
};

export type PermissionsType = { permissions: { getAll: string } };
