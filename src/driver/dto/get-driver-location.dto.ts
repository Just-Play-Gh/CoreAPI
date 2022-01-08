import { IsNotEmpty } from 'class-validator';

export class GetDriverLocationDto {
  @IsNotEmpty()
  driverId: number;
}
