import { Injectable } from '@nestjs/common';
import { BaseService } from 'src/resources/base.service';
import { Tax } from './entities/tax.entity';

@Injectable()
export class TaxService extends BaseService {
  constructor() {
    super(Tax);
  }
}
