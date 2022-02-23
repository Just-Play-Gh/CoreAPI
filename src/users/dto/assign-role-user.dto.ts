import { IsNotEmpty } from 'class-validator';

export class AssignRoleDto {
  @IsNotEmpty({ message: 'Role is required' })
  role: string;

  @IsNotEmpty({ message: 'User ID is required' })
  userId: string;
}
