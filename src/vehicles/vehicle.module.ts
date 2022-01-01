import { Module } from '@nestjs/common';
import { VehicleService } from './vehicle.service';
import { VehicleController } from './vehicle.controller';
import { HttpModule } from '@nestjs/axios';
import { SharedModule } from 'src/shared/shared.module';

@Module({
  imports: [HttpModule, SharedModule],
  providers: [VehicleService],
  controllers: [VehicleController],
})
export class VehicleModule {}
