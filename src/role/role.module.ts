import { Module } from '@nestjs/common';
import { PermissionService } from 'src/permission/permission.service';
import { RoleController } from './role.controller';
import { RoleService } from './role.service';

@Module({
  providers: [RoleService, PermissionService],
  exports: [RoleService],
  controllers: [RoleController],
})
export class RoleModule {}
