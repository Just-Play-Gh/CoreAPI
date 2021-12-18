import { IsArray, IsNotEmpty } from 'class-validator';

export class AssignPermissionToRoleDto {
  @IsNotEmpty({ message: 'Role id is required' })
  roleId: number;

  @IsNotEmpty({ message: 'Permission id is required' })
  @IsArray({ message: 'Your permissions must be an array' })
  permissionId: number[];
}
