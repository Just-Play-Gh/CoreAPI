import { Injectable } from '@nestjs/common';
import { Body } from 'node-mocks-http';
import { BaseService } from '../resources/base.service';
import { userEntities } from '../types';
import { Role } from './entity/role.entity';

@Injectable()
export class RoleService extends BaseService {
  constructor() {
    super(Role);
  }
}
