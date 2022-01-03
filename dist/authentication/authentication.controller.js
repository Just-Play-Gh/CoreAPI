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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthenticationController = void 0;
const common_1 = require("@nestjs/common");
const current_user_decorator_1 = require("../decorators/current-user.decorator");
const jwt_auth_guard_1 = require("../guards/jwt-auth.guard");
const refresh_token_guard_1 = require("../guards/refresh-token.guard");
const types_1 = require("../types");
const authentication_service_1 = require("./authentication.service");
const forgot_password_dto_1 = require("./dto/forgot-password.dto");
const reset_password_dto_1 = require("./dto/reset-password.dto");
let AuthenticationController = class AuthenticationController {
    constructor(authService) {
        this.authService = authService;
    }
    async login(res, loginDto, queries) {
        const { userType } = loginDto;
        if (!userType || !(userType in types_1.userEntities))
            throw new common_1.HttpException('Unauthorized', common_1.HttpStatus.UNAUTHORIZED);
        res.status(200);
        return this.authService.login(loginDto, queries, res);
    }
    async oauthLogin(res, loginDto, queries) {
        res.status(200);
        return this.authService.oauthLogin(loginDto, queries, res);
    }
    async registerDriver(registerDto, res) {
        registerDto['userType'] = 'driver';
        const { userType } = registerDto;
        if (!userType || !(userType in types_1.userEntities))
            throw new common_1.HttpException('Unauthorized', common_1.HttpStatus.UNAUTHORIZED);
        return this.authService.registerDriver(registerDto, res);
    }
    async registerCustomerSendOtp(registerSendOtpDto) {
        const { userType } = registerSendOtpDto;
        if (!userType || !(userType in types_1.userEntities))
            throw new common_1.HttpException('Unauthorized', common_1.HttpStatus.UNAUTHORIZED);
        return this.authService.registerCustomerSendOtp(registerSendOtpDto);
    }
    async verifyOtp(verifyOtpDto) {
        const { userType } = verifyOtpDto;
        if (!userType || !(userType in types_1.userEntities))
            throw new common_1.HttpException('Unauthorized', common_1.HttpStatus.UNAUTHORIZED);
        return this.authService.verifyOtp(verifyOtpDto);
    }
    async registerCustomer(registerDto, res) {
        registerDto['userType'] = 'customer';
        const { userType } = registerDto;
        if (!userType || !(userType in types_1.userEntities))
            throw new common_1.HttpException('Unauthorized', common_1.HttpStatus.UNAUTHORIZED);
        return this.authService.registerCustomer(registerDto, res);
    }
    async sendForgotPasswordEmal(forgotPasswordDto) {
        const { userType } = forgotPasswordDto;
        if (!userType || !(userType in types_1.userEntities))
            throw new common_1.HttpException('Unauthorized', common_1.HttpStatus.UNAUTHORIZED);
        return this.authService.sendForgotPasswordOtp(forgotPasswordDto);
    }
    async sendForgotPasswordEmail(forgotPassword) {
        const { userType } = forgotPassword;
        if (!userType || !(userType in types_1.userEntities))
            throw new common_1.HttpException('Unauthorized', common_1.HttpStatus.UNAUTHORIZED);
        return this.authService.sendForgotPasswordEmail(forgotPassword);
    }
    async resetPasswordWithOtp(resetPassword) {
        const { userType } = resetPassword;
        if (!userType || !(userType in types_1.userEntities))
            throw new common_1.HttpException('Unauthorized', common_1.HttpStatus.UNAUTHORIZED);
        return this.authService.resetPasswordWithOtp(resetPassword);
    }
    async resetPasswordWithEmail(resetPassword) {
        const { userType } = resetPassword;
        if (!userType || !(userType in types_1.userEntities))
            throw new common_1.HttpException('Unauthorized', common_1.HttpStatus.UNAUTHORIZED);
        return this.authService.resetPasswordWithEmail(resetPassword);
    }
    async changePassword(registerDto, userContext) {
        const { userType } = registerDto;
        if (!userType || !(userType in types_1.userEntities))
            throw new common_1.HttpException('Unauthorized', common_1.HttpStatus.UNAUTHORIZED);
        return this.authService.changePassword(registerDto, userContext);
    }
    async refreshToken(userContext, res, req) {
        return this.authService.refreshToken(userContext, req, res);
    }
};
__decorate([
    (0, common_1.Post)('/login'),
    __param(0, (0, common_1.Res)({ passthrough: true })),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", Promise)
], AuthenticationController.prototype, "login", null);
__decorate([
    (0, common_1.Post)('/oauth-login'),
    __param(0, (0, common_1.Res)({ passthrough: true })),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", Promise)
], AuthenticationController.prototype, "oauthLogin", null);
__decorate([
    (0, common_1.Post)('/register-driver'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Res)({ passthrough: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AuthenticationController.prototype, "registerDriver", null);
__decorate([
    (0, common_1.Post)('/send-otp'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthenticationController.prototype, "registerCustomerSendOtp", null);
__decorate([
    (0, common_1.Post)('/verify-otp'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthenticationController.prototype, "verifyOtp", null);
__decorate([
    (0, common_1.Post)('/register-customer'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Res)({ passthrough: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AuthenticationController.prototype, "registerCustomer", null);
__decorate([
    (0, common_1.Post)('/forgot-password/sendOtp'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [forgot_password_dto_1.ForgotPasswordWithOtp]),
    __metadata("design:returntype", Promise)
], AuthenticationController.prototype, "sendForgotPasswordEmal", null);
__decorate([
    (0, common_1.Post)('/forgot-password/sendEmail'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [forgot_password_dto_1.ForgotPasswordWithEmail]),
    __metadata("design:returntype", Promise)
], AuthenticationController.prototype, "sendForgotPasswordEmail", null);
__decorate([
    (0, common_1.Post)('/reset-password/otp'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [reset_password_dto_1.ResetPasswordOtpDto]),
    __metadata("design:returntype", Promise)
], AuthenticationController.prototype, "resetPasswordWithOtp", null);
__decorate([
    (0, common_1.Post)('/reset-password/email'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [reset_password_dto_1.ResetPasswordEmailDto]),
    __metadata("design:returntype", Promise)
], AuthenticationController.prototype, "resetPasswordWithEmail", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Post)('/change-password'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AuthenticationController.prototype, "changePassword", null);
__decorate([
    (0, common_1.UseGuards)(refresh_token_guard_1.RefreshTokenGuard),
    (0, common_1.Post)('/refresh-token'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Res)({ passthrough: true })),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", Promise)
], AuthenticationController.prototype, "refreshToken", null);
AuthenticationController = __decorate([
    (0, common_1.Controller)('auth'),
    __metadata("design:paramtypes", [authentication_service_1.AuthenticationService])
], AuthenticationController);
exports.AuthenticationController = AuthenticationController;
//# sourceMappingURL=authentication.controller.js.map