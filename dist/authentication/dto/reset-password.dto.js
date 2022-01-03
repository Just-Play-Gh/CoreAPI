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
exports.ResetPasswordEmailDto = exports.ResetPasswordOtpDto = void 0;
const class_validator_1 = require("class-validator");
const password_decorator_1 = require("../../helpers/password.decorator");
class ResetPasswordOtpDto {
}
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: 'Phone number is required' }),
    __metadata("design:type", String)
], ResetPasswordOtpDto.prototype, "phoneNumber", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: 'Password is required' }),
    (0, class_validator_1.MinLength)(6, { message: 'Password must be at least 6 characters long' }),
    __metadata("design:type", String)
], ResetPasswordOtpDto.prototype, "password", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: 'Password confirmation is required' }),
    (0, class_validator_1.MinLength)(6, { message: 'Password must be at least 6 characters long' }),
    (0, password_decorator_1.Match)('password', { message: 'Passwords do not match' }),
    __metadata("design:type", String)
], ResetPasswordOtpDto.prototype, "passwordConfirmation", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: 'OTP is required' }),
    __metadata("design:type", String)
], ResetPasswordOtpDto.prototype, "otp", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: 'Please enter your country' }),
    __metadata("design:type", String)
], ResetPasswordOtpDto.prototype, "country", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: 'User type required' }),
    __metadata("design:type", String)
], ResetPasswordOtpDto.prototype, "userType", void 0);
exports.ResetPasswordOtpDto = ResetPasswordOtpDto;
class ResetPasswordEmailDto {
}
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: 'Please enter your email' }),
    (0, class_validator_1.IsEmail)({}, { message: 'Please enter a valid email' }),
    __metadata("design:type", String)
], ResetPasswordEmailDto.prototype, "email", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: 'Password is required' }),
    (0, class_validator_1.MinLength)(6, { message: 'Password must be at least 6 characters long' }),
    __metadata("design:type", String)
], ResetPasswordEmailDto.prototype, "password", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: 'Password confirmation is required' }),
    (0, class_validator_1.MinLength)(6, { message: 'Password must be at least 6 characters long' }),
    (0, password_decorator_1.Match)('password', { message: 'Passwords do not match' }),
    __metadata("design:type", String)
], ResetPasswordEmailDto.prototype, "passwordConfirmation", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: 'OTP is required' }),
    __metadata("design:type", String)
], ResetPasswordEmailDto.prototype, "otp", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: 'User type required' }),
    __metadata("design:type", String)
], ResetPasswordEmailDto.prototype, "userType", void 0);
exports.ResetPasswordEmailDto = ResetPasswordEmailDto;
//# sourceMappingURL=reset-password.dto.js.map