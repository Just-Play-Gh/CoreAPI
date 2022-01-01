import { IsIn, IsOptional } from 'class-validator';
import { OrderStatusType } from '../entities/order.entity';

export class GetOrderDto {
  @IsOptional()
  limit: number;

  @IsOptional()
  page: number;

  @IsIn([
    OrderStatusType.Pending,
    OrderStatusType.Completed,
    OrderStatusType.Cancelled,
  ])
  @IsOptional()
  status: string;
}
