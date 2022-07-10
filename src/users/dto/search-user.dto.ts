import { IsAlphanumeric, IsIn, IsOptional } from 'class-validator';

export class SearchUserDto {
  @IsOptional()
  limit: number;

  @IsOptional()
  page: number;

  @IsIn(['name', 'email', 'phoneNumber', 'display_name'])
  @IsOptional()
  searchField: string;

  // Disallow bad characters
  @IsOptional()
  searchValue: string;
}
