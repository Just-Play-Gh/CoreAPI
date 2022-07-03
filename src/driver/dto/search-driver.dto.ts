import { IsAlphanumeric, IsIn, IsOptional } from 'class-validator';

export class SearchDriverDto {
  @IsOptional()
  limit: number;

  @IsOptional()
  page: number;

  // @IsIn(['email', 'display_name'])
  // @IsOptional()
  // searchField: string;

  @IsAlphanumeric()
  @IsOptional()
  searchValue: string;
}
