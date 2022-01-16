import { Module } from '@nestjs/common';
import { MobileDeviceController } from './mobile-devices.controller';
import { MobileDeviceService } from './mobile-devices.service';

@Module({
  providers: [MobileDeviceService],
  exports: [MobileDeviceService],
  controllers: [MobileDeviceController],
})
export class MobileDeviceModule {}
