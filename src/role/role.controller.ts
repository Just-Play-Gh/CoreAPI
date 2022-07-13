import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { BaseController } from '../resources/base.controller';
import { CreateRoleDto } from './dto/create-role.dto';
import { Role } from './entity/role.entity';
import { RoleService } from './role.service';

@Controller('roles')
export class RoleController extends BaseController {
  constructor(private readonly rolesService: RoleService) {
    super(rolesService);
    this.dtos = { store: CreateRoleDto };
  }

  @UseGuards(JwtAuthGuard)
  // @UseGuards(JwtAuthGuard, PermissionGuard)
  @Post()
  async store(@Body() body: CreateRoleDto): Promise<Role> {
    return await this.rolesService.store(body);
  }
}
