import { IsNotEmpty, IsOptional } from 'class-validator';
import { Permission } from 'src/permission/entity/permission.entity';

export class CreateRoleDto {
  @IsNotEmpty({ message: 'Role name is required' })
  name: string;

  @IsNotEmpty({ message: 'Permission is required' })
  permissions: [Permission];

  @IsOptional({ message: 'Role alias is required' })
  alias: string;
}
