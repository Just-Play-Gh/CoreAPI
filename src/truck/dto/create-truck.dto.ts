import { IsNotEmpty, IsOptional } from 'class-validator';

export class CreateTruckDto {
  @IsNotEmpty({ message: 'The truck name is required' })
  name: string;

  @IsOptional()
  numberPlate: string;

  @IsOptional()
  driverId: number;

  @IsOptional()
  description: string;

  @IsOptional()
  fuelCapacity: number;
}
