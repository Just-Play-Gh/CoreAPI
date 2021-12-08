import { IsAlphanumeric, IsIn, IsOptional } from 'class-validator';

export class SearchProductDto {
  @IsOptional()
  limit: number;

  @IsOptional()
  page: number;

  @IsIn(['name', 'display_name'])
  @IsOptional()
  searchField: string;

  @IsAlphanumeric()
  @IsOptional()
  searchValue: string;
}
