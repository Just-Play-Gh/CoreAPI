import { Module } from '@nestjs/common';
import { DriverService } from './driver.service';
import { DriverController } from './driver.controller';
import { SharedModule } from 'src/shared/shared.module';
import { HttpModule } from '@nestjs/axios';
console.log('Here');
console.log(process.env.DB_PORT);
@Module({
  imports: [SharedModule, HttpModule],
  controllers: [DriverController],
  providers: [DriverService],
})
export class DriverModule {}
