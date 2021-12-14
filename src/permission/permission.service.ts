import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { BaseService } from 'src/resources/base.service';
import { Role } from 'src/role/entity/role.entity';
import { ResponseMessage } from 'src/types';
import { getConnection, getRepository, In } from 'typeorm';
import { AssignPermissionToRoleDto } from './dto/assign-role.dto';
import { Permission } from './entity/permission.entity';

@Injectable()
export class PermissionService extends BaseService {
  constructor() {
    super(Permission);
  }

  async assignPermissionToRole(body: AssignPermissionToRoleDto): Promise<Role> {
    const { permissionId, roleId } = body;
    const permissions = await getRepository(Permission).find({
      where: { id: In(permissionId) },
    });
    const role = await Role.findOne(
      { id: roleId },
      { relations: ['permissions'] },
    );
    role.permissions = [];
    role.permissions = permissions;
    role.save();
    return role;
  }

  async hasPermission(permission: string) {
    const permissions = await (await this.getAll({})).items;
    return permissions
      .map((permission) => permission.name)
      .includes(permission);
  }

  async hasAnyPermission(permission: string[]) {
    console.log(permission);
  }
}
