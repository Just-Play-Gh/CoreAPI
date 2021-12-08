import { IsOptional } from 'class-validator';

export class RequestDto {
  @IsOptional()
  limit?: number;

  @IsOptional()
  count?: string;

  @IsOptional()
  contain?: string;

  @IsOptional()
  orderBy?: string;

  @IsOptional()
  columns?: string;
}
