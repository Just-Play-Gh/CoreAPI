import { IsNotEmpty, IsOptional } from 'class-validator';

export class CreateGroupDto {
  @IsNotEmpty({ message: 'The name field is required' })
  name: string;

  @IsOptional()
  description: string;
}
