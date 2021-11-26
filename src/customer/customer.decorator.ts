import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Driver } from 'src/driver/entities/driver.entity';
import { Customer } from './entities/customer.entity';

export const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.customer as Customer | Driver;
  },
);
