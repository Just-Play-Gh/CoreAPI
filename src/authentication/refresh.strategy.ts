import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { RefreshToken } from './entity/refresh-token.entity';

@Injectable()
export class RefreshStrategy extends PassportStrategy(Strategy, 'refresh') {
  constructor() {
    super({
      ignoreExpiration: true,
      passReqToCallback: true,
      secretOrKey: process.env.JWT_SECRET,
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => {
          const data = request?.cookies['auth-cookie'];
          if (!data) {
            return null;
          }
          return data.token;
        },
      ]),
    });
  }

  async validate(req: Request, payload: any) {
    if (!payload) {
      throw new UnauthorizedException();
    }
    const data = req?.cookies['auth-cookie'];
    if (!data?.refreshToken) {
      throw new UnauthorizedException();
    }
    const refreshToken = await RefreshToken.findOne({
      userId: payload.id,
      token: data?.refreshToken.token,
    });
    if (!refreshToken) {
      throw new UnauthorizedException();
    }
    delete payload.exp;
    delete payload.iat;
    return payload;
  }
}
