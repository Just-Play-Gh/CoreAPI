import { BaseController } from '../resources/base.controller';
import { TaxService } from './tax.service';
export declare class TaxController extends BaseController {
    private readonly taxService;
    constructor(taxService: TaxService);
}
