import { IsIn, IsOptional } from 'class-validator';
import { GeofenceStatus } from '../entities/geofence.entity';
export class GetGeofencesDto {
  @IsOptional()
  limit: number;

  @IsOptional()
  page: number;

  @IsIn([GeofenceStatus.Active, GeofenceStatus.Inactive])
  @IsOptional()
  status: string;
}
