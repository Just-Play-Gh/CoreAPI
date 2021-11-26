import { IsNotEmpty, IsOptional } from 'class-validator';

export class UpdateOrderDto {
  @IsNotEmpty()
  driverId: string;
  @IsOptional()
  customerLocation: string;
}
