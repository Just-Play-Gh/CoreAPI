import { User } from 'src/users/entities/user.entity';
import { Customer } from '../customer/entities/customer.entity';
import { Driver } from '../driver/entities/driver.entity';

export enum StatusType {
  Active = '1',
  Inactive = '0',
}

export enum DriverStatusType {
  Active = 'active',
  Inactive = 'inactive',
}

export const userEntities = {
  customer: Customer,
  driver: Driver,
  user: User,
};

export type ResponseMessage = {
  message: string;
};

export type PermissionsType = { permissions: { getAll: string } };

export type NotificationDataType = {
  token: string;
  sound: string;
  body: string;
  data: any;
};
