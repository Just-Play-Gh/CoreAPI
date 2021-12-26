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
exports.RegisterCustomerDto = void 0;
const class_validator_1 = require("class-validator");
class RegisterCustomerDto {
}
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: 'Please enter your first name' }),
    __metadata("design:type", String)
], RegisterCustomerDto.prototype, "firstName", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: 'Please enter your last name' }),
    __metadata("design:type", String)
], RegisterCustomerDto.prototype, "lastName", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: 'Please enter your phone number' }),
    __metadata("design:type", String)
], RegisterCustomerDto.prototype, "phoneNumber", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: 'Please enter your email' }),
    (0, class_validator_1.IsEmail)({}, { message: 'Please enter a valid email' }),
    __metadata("design:type", String)
], RegisterCustomerDto.prototype, "email", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], RegisterCustomerDto.prototype, "provider", void 0);
exports.RegisterCustomerDto = RegisterCustomerDto;
//# sourceMappingURL=register-customer.dto.js.map