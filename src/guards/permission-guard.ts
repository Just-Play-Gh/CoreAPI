import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from 'src/role/entity/role.entity';
import { PermissionService } from '../permission/permission.service';

@Injectable()
export class PermissionGuard implements CanActivate {
  constructor(
    public reflector: Reflector,
    private readonly permissionService: PermissionService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    let permissions = this.reflector.get<string[] | string>(
      'permissions',
      context.getHandler(),
    );
    const className = context.getClass().name.split('Controller')[0];
    const isInBaseController = context
      .getClass()
      .toString()
      .includes('BaseController');
    const { user } = context.switchToHttp().getRequest();
    if (!user.role) return false;
    const role: Role = JSON.parse(user.role);
    if (!role) {
      console.log('Role not found. Permission denied', user);
      return false;
    }
    if (isInBaseController && !permissions) {
      const name = `${className.toLowerCase()}`;
      const action = context.getHandler().name;
      permissions = `${action}-${name}`;
    }
    const rolePermissions = await Role.findOne(
      { id: role.id },
      { relations: ['permissions'] },
    );

    if (typeof permissions === 'string')
      return await this.permissionService.hasPermission(
        permissions,
        rolePermissions,
      );

    return await this.permissionService.hasPermissions(
      permissions,
      rolePermissions,
    );
  }
}
