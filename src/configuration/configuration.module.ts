import { Module } from '@nestjs/common';
import { ConfigurationService } from './configuration.service';
import { ConfigurationController } from './configuration.controller';
import { SharedModule } from 'src/shared/shared.module';

@Module({
  providers: [ConfigurationService],
  controllers: [ConfigurationController],
  imports: [SharedModule],
})
export class ConfigurationModule {}
