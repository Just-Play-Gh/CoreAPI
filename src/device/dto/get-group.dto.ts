import { IsOptional } from 'class-validator';
export class GetGroupsDto {
  @IsOptional()
  limit: number;

  @IsOptional()
  page: number;
}
