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
    const name = `${className.toLowerCase()}_management`;
    const scope = `${className.toLowerCase()}s`;
    const action = context.getHandler().name;
    const permission = `${name}:${scope}:${action}`;
    return await this.permissionService.hasPermission(permission);
  }
}
