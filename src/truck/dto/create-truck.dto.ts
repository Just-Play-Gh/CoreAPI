import { IsIn, IsNotEmpty, IsOptional } from 'class-validator';
import { TruckStatus } from '../entities/truck.entity';

export class CreateTruckDto {
  @IsNotEmpty({ message: 'The truck name is required' })
  name: string;

  @IsOptional()
  numberPlate: string;

  @IsOptional()
  driverId: string;

  @IsOptional()
  description: string;

  @IsNotEmpty()
  fuelCapacity: number;

  @IsIn([
    TruckStatus.Active,
    TruckStatus.Inactive,
    TruckStatus.Unassigned,
    TruckStatus.Assigned,
  ])
  @IsOptional()
  status: TruckStatus;
}
