import { Body, Controller, Post } from '@nestjs/common';
import { BaseController } from '../resources/base.controller';
import { AssignPermissionToRoleDto } from './dto/assign-role.dto';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { PermissionService } from './permission.service';

@Controller('permissions')
export class PermissionController extends BaseController {
  constructor(private readonly permissionService: PermissionService) {
    super(permissionService);
    this.dtos = { store: CreatePermissionDto };
  }

  @Post('/assign/role')
  async assignPermissionsToRole(@Body() body: AssignPermissionToRoleDto) {
    return this.permissionService.assignPermissionsToRole(body);
  }
}
