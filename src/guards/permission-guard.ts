import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PermissionService } from '../permission/permission.service';

@Injectable()
// export const PermissionGuard = (role: string) => {};
export class PermissionGuard implements CanActivate {
  constructor(
    public reflector: Reflector,
    private readonly permissionService: PermissionService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const permissions = this.reflector.get<string[]>(
      'permissions',
      context.getHandler(),
    );
    const className = context.getClass().name.split('Controller')[0];
    const isInBaseController = context
      .getClass()
      .toString()
      .includes('BaseController');
    const requestUser = context.switchToHttp().getRequest().user;
    if (!requestUser.role) return false;

    const role = JSON.parse(requestUser.role);
    let permission: string | string[];
    if (isInBaseController) {
      const name = `${className.toLowerCase()}`;
      const action = context.getHandler().name;
      permission = `${action}-${name}`;
    }

    if (typeof permission === 'string')
      return await this.permissionService.hasPermission(permission, role);
    if (!permissions) return false;
    return await this.permissionService.hasPermissions(permissions, role);
  }
}
