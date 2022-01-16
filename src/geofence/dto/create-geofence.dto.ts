import { IsIn, IsLatLong, IsNotEmpty, IsOptional } from 'class-validator';
import { GeofenceStatus } from '../entities/geofence.entity';

export class CreateGeofenceDto {
  @IsNotEmpty()
  @IsLatLong()
  focusPoint: string;

  @IsNotEmpty()
  radius: number;

  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  description: string;

  @IsIn([GeofenceStatus.Active, GeofenceStatus.Inactive])
  @IsOptional()
  status: GeofenceStatus;
}
