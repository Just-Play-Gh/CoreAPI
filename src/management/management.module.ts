import { Module } from '@nestjs/common';
import { ManagementService } from './management.service';
import { ManagementController } from './management.controller';
import { DeviceService } from 'src/device/device.service';

@Module({
  controllers: [ManagementController],
  providers: [ManagementService, DeviceService],
})
export class ManagementModule {}
