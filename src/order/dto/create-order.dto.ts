import { ApiProperty } from '@nestjs/swagger';
import {
  IsDateString,
  IsLatLong,
  IsNotEmpty,
  IsOptional,
} from 'class-validator';
import { OrderDevice } from '../entities/order-devices.entity';

export class CreateOrderDto {
  @IsOptional()
  @ApiProperty()
  customerId: string;

  @IsOptional()
  @ApiProperty()
  customerFullName: string;

  @IsOptional()
  @ApiProperty()
  driverId: string;

  @IsOptional({ message: 'The amount field is required' })
  @ApiProperty()
  amount: number;

  @IsOptional({ message: 'The device field is required' })
  @ApiProperty()
  device: string;

  @IsNotEmpty({ message: 'The devices field is required' })
  @ApiProperty()
  devices: [OrderDevice];

  @IsNotEmpty({ message: 'The address field is required' })
  @ApiProperty()
  address: string;

  @IsNotEmpty({ message: 'The channel field is required' })
  @ApiProperty()
  channel: string;

  @IsOptional()
  @ApiProperty()
  currency: string;

  @IsNotEmpty({ message: 'The Product ID is required' })
  @ApiProperty()
  productId: number;

  @IsOptional()
  @ApiProperty()
  litres: number;

  @IsLatLong({ message: 'Customer latitude,longitude is required' })
  @ApiProperty()
  latlong: string;

  @IsDateString()
  @ApiProperty()
  scheduleDate: Date;

  @IsOptional()
  @ApiProperty()
  customerLocation: string;
}
