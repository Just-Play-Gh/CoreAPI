import { Module } from '@nestjs/common';
import { RoleModule } from 'src/role/role.module';
import { SharedModule } from 'src/shared/shared.module';
import { TaxController } from './tax.controller';
import { TaxService } from './tax.service';

@Module({
  imports: [SharedModule],
  controllers: [TaxController],
  providers: [TaxService],
})
export class TaxModule {}
