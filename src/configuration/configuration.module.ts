import { Module } from '@nestjs/common';
import { ConfigurationService } from './configuration.service';
import { ConfigurationController } from './configuration.controller';
import { PermissionService } from 'src/permission/permission.service';

@Module({
  providers: [ConfigurationService, PermissionService],
  controllers: [ConfigurationController],
})
export class ConfigurationModule {}
