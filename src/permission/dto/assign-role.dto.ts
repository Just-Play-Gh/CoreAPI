import { IsNotEmpty } from 'class-validator';

export class AssignPermissionToRoleDto {
  @IsNotEmpty({ message: 'Role id is required' })
  roleId: number;

  @IsNotEmpty({ message: 'Permission id is required' })
  permissionId: string | string[];
}
