import { IsLatLong, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateOrderDto {
  @IsOptional()
  customerId: string;

  @IsOptional()
  customerFullName: string;

  @IsOptional()
  driverId: string;

  @IsNotEmpty({ message: 'The amount field is required' })
  amount: number;

  @IsOptional()
  currency: string;

  @IsNotEmpty({ message: 'The channel field is required' })
  channel: string;

  @IsNotEmpty({ message: 'The Product ID is required' })
  productId: number;

  @IsLatLong({ message: 'Customer latitude,longitude is required' })
  latlong: string;

  @IsOptional()
  customerLocation: string;
}
