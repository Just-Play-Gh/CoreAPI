import {
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

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
        throw new HttpException('Token Expired', 402);
      }
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    }
    return user;
  }
}
