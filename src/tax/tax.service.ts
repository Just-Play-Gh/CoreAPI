import { Injectable } from '@nestjs/common';
import { BaseService } from '../resources/base.service';
import { Tax } from './entities/tax.entity';

@Injectable()
export class TaxService extends BaseService {
  constructor() {
    super(Tax);
  }
}
