import { IsLatLong, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateOrderDto {
  @IsNotEmpty({ message: 'Invoice ID is required' })
  invoiceId: string;

  @IsNotEmpty({ message: 'Customer ID is required' })
  customerId: string;

  @IsOptional()
  driverId: string;

  @IsLatLong({ message: 'customer latitude,longitude is required' })
  latlong: number;

  @IsOptional()
  customerLocation: string;
}
