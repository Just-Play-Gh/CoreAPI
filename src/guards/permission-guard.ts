import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PermissionService } from '../permission/permission.service';

@Injectable()
export class PermissionGuard implements CanActivate {
  constructor(
    public reflector: Reflector,
    private readonly permissionService: PermissionService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const className = context.getClass().name.split('Controller')[0];
    const name = `${className.toLowerCase()}`;
    const action = context.getHandler().name;
    const permission = `${action}-${name}`;
    const requestUser = context.switchToHttp().getRequest().user;
    if (!requestUser.role) return false;
    const role = JSON.parse(requestUser.role);
    return await this.permissionService.hasPermission(permission, role);
  }
}
