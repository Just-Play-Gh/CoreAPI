import { Injectable, Logger } from '@nestjs/common';
import { BaseService } from '../resources/base.service';
import { Role } from './entity/role.entity';

@Injectable()
export class RoleService extends BaseService {
  constructor() {
    super(Role);
  }

  async roleByAlias(alias: string) {
    try {
      const role = await Role.findOne({ alias: alias });
      return role;
    } catch (error) {
      Logger.error('eeror finding role by alias', error);
      throw error;
    }
  }
}
