import { IsNotEmpty } from 'class-validator';

export class CreateRoleDto {
  @IsNotEmpty({ message: 'Role name is required' })
  name: string;

  @IsNotEmpty({ message: 'Role alias is required' })
  alias: string;
}
