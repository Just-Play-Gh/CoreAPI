import { Injectable } from '@nestjs/common';
import { BaseService } from '../resources/base.service';
import { Role } from '../role/entity/role.entity';
import { getRepository, In } from 'typeorm';
import { AssignPermissionToRoleDto } from './dto/assign-role.dto';
import { Permission } from './entity/permission.entity';
import { CurrentUser } from 'src/decorators/current-user.decorator';

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

  async hasAnyPermission(permission: string[]) {
    console.log(permission);
  }
}
