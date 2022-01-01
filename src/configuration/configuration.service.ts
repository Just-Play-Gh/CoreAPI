import { Injectable } from '@nestjs/common';
import { BaseService } from 'src/resources/base.service';
import { Configuration } from './entities/configuration.entity';

@Injectable()
export class ConfigurationService extends BaseService {
  constructor() {
    super(Configuration);
  }
}
