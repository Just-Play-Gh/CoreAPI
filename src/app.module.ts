import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DriverModule } from './driver/driver.module';
import { CustomerModule } from './customer/customer.module';
@Module({
  imports: [DriverModule, CustomerModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
