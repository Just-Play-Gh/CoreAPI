import { Module } from '@nestjs/common';
import { DeviceService } from './device.service';
import { DeviceController } from './device.controller';
import { SharedModule } from 'src/shared/shared.module';
import { GroupsController } from './groups.controller';
import { GroupsService } from './groups.service';

@Module({
  imports: [SharedModule],
  controllers: [DeviceController, GroupsController],
  providers: [DeviceService, GroupsService],
})
export class DeviceModule {}
