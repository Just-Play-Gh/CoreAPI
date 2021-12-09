import { Controller } from '@nestjs/common';
import { BaseController } from '../resources/base.controller';
import { CreateTaxDto } from './dto/create-tax.dto';
import { TaxService } from './tax.service';

@Controller('taxes')
export class TaxController extends BaseController {
  constructor(private readonly taxService: TaxService) {
    super(taxService);
    this.dtos = { store: CreateTaxDto };
  }
}
