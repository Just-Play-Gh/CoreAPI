import {
  IsDateString,
  IsLatLong,
  IsNotEmpty,
  IsOptional,
} from 'class-validator';

export class CreateOrderDto {
  @IsOptional()
  customerId: string;

  @IsOptional()
  customerFullName: string;

  @IsOptional()
  driverId: string;

  @IsNotEmpty({ message: 'The amount field is required' })
  amount: number;

  @IsNotEmpty({ message: 'The device field is required' })
  device: string;

  @IsNotEmpty({ message: 'The address field is required' })
  address: string;

  @IsNotEmpty({ message: 'The channel field is required' })
  channel: string;

  @IsOptional()
  currency: string;

  @IsNotEmpty({ message: 'The Product ID is required' })
  productId: number;

  @IsOptional()
  litres: number;

  @IsLatLong({ message: 'Customer latitude,longitude is required' })
  latlong: string;

  @IsDateString()
  scheduleDate: Date;

  @IsOptional()
  customerLocation: string;
}
