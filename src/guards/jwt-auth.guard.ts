import {
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Customer } from 'src/customer/entities/customer.entity';
import { Driver } from 'src/driver/entities/driver.entity';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  getRequest(context: ExecutionContext): Request {
    const ctx = context.switchToHttp();
    const req = ctx.getRequest<Request>();
    return req;
  }

  handleRequest(err: Error, user, info: Error) {
    if (!user) {
      if (info.name === 'TokenExpiredError') {
        throw new HttpException('Token Expired', HttpStatus.FORBIDDEN);
      }
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    }
    return user;
  }
}
