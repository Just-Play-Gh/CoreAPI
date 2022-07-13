import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { PermissionService } from 'src/permission/permission.service';

@Module({
  controllers: [UsersController],
  providers: [UsersService, PermissionService],
})
export class UsersModule {}
