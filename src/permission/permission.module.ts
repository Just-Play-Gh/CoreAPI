import { Module } from '@nestjs/common';
import { SharedModule } from 'src/shared/shared.module';
import { PermissionController } from './permission.controller';
import { PermissionService } from './permission.service';

@Module({
  controllers: [PermissionController],
  providers: [PermissionService],
  exports: [PermissionService],
})
export class PermissionModule {}
