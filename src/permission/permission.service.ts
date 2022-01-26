import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
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

  async hasPermission(permission: string, @CurrentUser() user?) {
    if (!user)
      throw new HttpException('No users were found', HttpStatus.NOT_FOUND);

    return await user.role.permissions
      .map((permission) => permission.name)
      .includes(permission);
  }

  async hasAnyPermission(permission: string[]) {
    console.log(permission);
  }
}
