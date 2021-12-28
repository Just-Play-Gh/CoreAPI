import { IsOptional } from 'class-validator';

export class GetOrderDto {
  @IsOptional()
  limit: number;

  @IsOptional()
  page: number;
}
