import { IsNotEmpty } from 'class-validator';

export class AssignRoleDto {
  @IsNotEmpty({ message: 'Please enter a role ID' })
  roleId: string;

  @IsNotEmpty({ message: 'Please enter a user ID' })
  userId: string;
}
