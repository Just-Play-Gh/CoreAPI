import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { BaseService } from '../resources/base.service';
import { Role } from '../role/entity/role.entity';
import { createQueryBuilder, getRepository, In } from 'typeorm';
import { AssignPermissionToRoleDto } from './dto/assign-role.dto';
import { Permission } from './entity/permission.entity';
import { CurrentUser } from 'src/decorators/current-user.decorator';
import { rolePermissions } from './defaultRolePermissions';

@Injectable()
export class PermissionService extends BaseService {
  constructor() {
    super(Permission);
  }

  async assignPermissionsToRole(
    body: AssignPermissionToRoleDto,
  ): Promise<Role> {
    const { permissionIds, roleId } = body;
    const permissions = await getRepository(Permission).find({
      where: { id: In(permissionIds) },
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

  async hasPermission(permission: string, role: Role) {
    return role.permissions
      .map((permission) => permission.name)
      .includes(permission);
  }

  async hasPermissions(permissions: string[], role: Role) {
    return (
      role.permissions.filter((permission) =>
        permissions.includes(permission.name),
      ).length === permissions.length
    );
  }

  async setDefaultRolePermissions() {
    for (const alias in rolePermissions) {
      const newPermissions = rolePermissions[alias];
      const role = await Role.findOne({
        where: { alias: alias.toLowerCase() },
        relations: ['permissions'],
      });
      const permissions = await Permission.find({
        where: { name: In(newPermissions) },
      });
      role.permissions = permissions;
      role.save();
    }

    return { status: 'ok' };
  }
}
