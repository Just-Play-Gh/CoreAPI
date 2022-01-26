import { Controller, Get } from '@nestjs/common';
import { BaseController } from '../resources/base.controller';
import { CreateRoleDto } from './dto/create-role.dto';
import { RoleService } from './role.service';

@Controller('roles')
export class RoleController extends BaseController {
  constructor(private readonly rolesService: RoleService) {
    super(rolesService);
    this.dtos = { store: CreateRoleDto };
  }
}
