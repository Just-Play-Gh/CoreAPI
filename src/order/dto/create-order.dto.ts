import { IsNotEmpty, IsOptional } from 'class-validator';

export class CreateOrderDto {
  @IsNotEmpty({ message: 'Invoice ID is required' })
  invoiceId: string;

  @IsNotEmpty({ message: 'Customer ID is required' })
  customerId: string;

  @IsOptional()
  driverId: string;

  @IsNotEmpty({ message: 'customer Latitude is required' })
  customerLatitude: number;

  @IsNotEmpty({ message: 'customer Longitude is required' })
  customerLongitude: number;

  @IsOptional()
  customerLocation: string;
}
