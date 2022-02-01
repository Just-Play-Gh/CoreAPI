import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { PermissionGuard } from 'src/guards/permission-guard';
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

  // @UseGuards(JwtAuthGuard, PermissionGuard)
  @UseGuards(JwtAuthGuard)
  @Post('/assign/role')
  async assignPermissionsToRole(@Body() body: AssignPermissionToRoleDto) {
    return this.permissionService.assignPermissionsToRole(body);
  }
}
