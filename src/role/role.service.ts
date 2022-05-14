import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import {
  IPaginationOptions,
  paginate,
  Pagination,
} from 'nestjs-typeorm-paginate';
import { createQueryBuilder, Not } from 'typeorm';
import { BaseService } from '../resources/base.service';
import { Role } from './entity/role.entity';

@Injectable()
export class RoleService extends BaseService {
  constructor() {
    super(Role);
  }

  async getAll(
    options: IPaginationOptions,
    filter = {},
  ): Promise<Pagination<Role>> {
    const rolesRepository = createQueryBuilder(Role, 'roles')
      .where(filter)
      .leftJoinAndSelect('roles.permissions', 'permissions') // Give me only roels with permissions
      // .where('orders.driverId = drivers.id')
      .orderBy({ 'roles.created': 'DESC' });

    const roles = await paginate<Role>(rolesRepository, options);
    if (!roles['items'])
      throw new HttpException('No roles were found', HttpStatus.NOT_FOUND);
    return roles;
  }

  async createRoleWithPermission(
    options: IPaginationOptions,
    filter = {},
  ): Promise<Pagination<Role>> {
    const roleRepository = createQueryBuilder(Role, 'roles')
      .where(filter)
      .leftJoinAndSelect('roles.permissions', 'permissions')
      // .where('orders.driverId = drivers.id')
      .orderBy({ 'roles.created': 'DESC' });

    const roles = await paginate<Role>(roleRepository, options);
    if (!roles['items'])
      throw new HttpException('No roles were found', HttpStatus.NOT_FOUND);
    return roles;
  }
  async roleByAlias(alias: string) {
    try {
      const role = await Role.findOne({ alias: alias });
      return role;
    } catch (error) {
      Logger.error('Error finding role by alias', error);
      throw error;
    }
  }
}
