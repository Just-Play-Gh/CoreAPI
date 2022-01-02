import { Module } from '@nestjs/common';
import { DriverService } from './driver.service';
import { DriverController } from './driver.controller';
import { SharedModule } from 'src/shared/shared.module';
console.log('Here');
console.log(process.env);
@Module({
  imports: [SharedModule],
  controllers: [DriverController],
  providers: [DriverService],
})
export class DriverModule {}
