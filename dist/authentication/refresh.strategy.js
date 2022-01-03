"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RefreshStrategy = void 0;
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const passport_jwt_1 = require("passport-jwt");
const refresh_token_entity_1 = require("./entity/refresh-token.entity");
let RefreshStrategy = class RefreshStrategy extends (0, passport_1.PassportStrategy)(passport_jwt_1.Strategy, 'refresh') {
    constructor() {
        super({
            ignoreExpiration: true,
            passReqToCallback: true,
            secretOrKey: process.env.JWT_SECRET || '123456',
            jwtFromRequest: passport_jwt_1.ExtractJwt.fromExtractors([
                (request) => {
                    const data = request === null || request === void 0 ? void 0 : request.cookies['auth-cookie'];
                    if (!data) {
                        return null;
                    }
                    return data.token;
                },
            ]),
        });
    }
    async validate(req, payload) {
        if (!payload) {
            throw new common_1.UnauthorizedException();
        }
        const data = req === null || req === void 0 ? void 0 : req.cookies['auth-cookie'];
        if (!(data === null || data === void 0 ? void 0 : data.refreshToken)) {
            throw new common_1.UnauthorizedException();
        }
        const refreshToken = await refresh_token_entity_1.RefreshToken.findOne({
            userId: payload.id,
            token: data === null || data === void 0 ? void 0 : data.refreshToken.token,
        });
        if (!refreshToken) {
            throw new common_1.UnauthorizedException();
        }
        delete payload.exp;
        delete payload.iat;
        return payload;
    }
};
RefreshStrategy = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], RefreshStrategy);
exports.RefreshStrategy = RefreshStrategy;
//# sourceMappingURL=refresh.strategy.js.map