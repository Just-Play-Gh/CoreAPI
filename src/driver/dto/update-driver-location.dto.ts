import { IsLatLong, IsNotEmpty } from 'class-validator';

export class UpdateDriverLocationDto {
  @IsNotEmpty()
  @IsLatLong()
  coordinates: string;
}
