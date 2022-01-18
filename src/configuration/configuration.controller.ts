import { Controller } from '@nestjs/common';
import { BaseController } from 'src/resources/base.controller';
import { ConfigurationService } from './configuration.service';

@Controller('configuration')
export class ConfigurationController extends BaseController {
  constructor(private readonly configurationservice: ConfigurationService) {
    super(configurationservice);
  }
}
