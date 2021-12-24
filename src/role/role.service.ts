import { Injectable } from '@nestjs/common';
import { BaseService } from '../resources/base.service';
import { Role } from './entity/role.entity';

@Injectable()
export class RoleService extends BaseService {
  constructor() {
    super(Role);
  }
}
