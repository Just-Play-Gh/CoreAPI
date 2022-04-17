import {
  IsDateString,
  IsLatLong,
  IsNotEmpty,
  IsOptional,
} from 'class-validator';

export class UpdateOrderDto {
  @IsNotEmpty()
  driverId: string;

  @IsNotEmpty()
  amount: string;

  @IsOptional()
  channel: string;

  @IsDateString()
  scheduleDate: Date;

  @IsLatLong({ message: 'Customer latitude,longitude is required' })
  latlong: string;

  @IsOptional()
  customerLocation: string;
}
