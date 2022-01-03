"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthenticationModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const jwt_1 = require("@nestjs/jwt");
const notification_module_1 = require("../notification/notification.module");
const shared_module_1 = require("../shared/shared.module");
const authentication_controller_1 = require("./authentication.controller");
const authentication_service_1 = require("./authentication.service");
const jwt_strategy_1 = require("./jwt.strategy");
const refresh_strategy_1 = require("./refresh.strategy");
let AuthenticationModule = class AuthenticationModule {
};
AuthenticationModule = __decorate([
    (0, common_1.Module)({
        imports: [
            jwt_1.JwtModule.registerAsync({
                imports: [config_1.ConfigModule],
                useFactory: async () => ({
                    secret: process.env.JWT_SECRET || '123456',
                    signOptions: {
                        expiresIn: `${process.env.JWT_TOKEN_EXPIRES_IN_SECONDS}s`,
                    },
                }),
                inject: [config_1.ConfigService],
            }),
            notification_module_1.NotificationModule,
            shared_module_1.SharedModule,
        ],
        controllers: [authentication_controller_1.AuthenticationController],
        providers: [authentication_service_1.AuthenticationService, jwt_strategy_1.JwtStrategy, refresh_strategy_1.RefreshStrategy],
    })
], AuthenticationModule);
exports.AuthenticationModule = AuthenticationModule;
//# sourceMappingURL=authentication.module.js.map