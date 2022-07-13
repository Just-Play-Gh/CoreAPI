import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import {
  IPaginationOptions,
  paginate,
  Pagination,
} from 'nestjs-typeorm-paginate';
import { Permission } from 'src/permission/entity/permission.entity';
import { createQueryBuilder, Not } from 'typeorm';
import { BaseService } from '../resources/base.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { Role } from './entity/role.entity';

@Injectable()
export class RoleService extends BaseService {
  constructor() {
    super(Role);
  }

  async store(createRoleDto: CreateRoleDto) {
    try {
      console.log('Store role', createRoleDto);
      const newPerms = createRoleDto.permissions;
      delete createRoleDto.permissions;
      const roleDto = await Role.create(createRoleDto);
      const createdRole = await Role.save(roleDto);
      const perms = await Permission.create(newPerms);
      const permissionsToSave = await perms.map((permission) => {
        permission.id = permission.id;
        return permission;
      });
      createdRole.permissions = permissionsToSave;
      const response = await createdRole.save();
      return response;
    } catch (error) {
      console.log('An error occured', error);
      throw new HttpException('Sorry an error occured', HttpStatus.BAD_REQUEST);
    }
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
    if (!roles['items']) {
      console.log('No roles were found');
      throw new HttpException('No roles were found', HttpStatus.NOT_FOUND);
    }
    return roles;
  }

  async getOne(param): Promise<Role> {
    const { id } = param;
    const roles = createQueryBuilder(Role, 'roles')
      .where({ id: id })
      .leftJoinAndSelect('roles.permissions', 'permissions') // Give me only roels with permissions
      .getOne();

    if (!roles) {
      console.log('No roles were found');
      throw new HttpException('No roles were found', HttpStatus.NOT_FOUND);
    }
    return roles;
  }

  async getRoleWithPermission(
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
