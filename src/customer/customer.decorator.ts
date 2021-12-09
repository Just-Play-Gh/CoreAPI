import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Driver } from '../driver/entities/driver.entity';
import { Customer } from './entities/customer.entity';

export const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user as Customer | Driver;
  },
);
