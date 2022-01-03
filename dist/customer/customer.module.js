"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var CustomerModule_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomerModule = void 0;
const common_1 = require("@nestjs/common");
const customer_controller_1 = require("./customer.controller");
const customer_service_1 = require("./customer.service");
const shared_module_1 = require("../shared/shared.module");
let CustomerModule = CustomerModule_1 = class CustomerModule {
};
CustomerModule = CustomerModule_1 = __decorate([
    (0, common_1.Module)({
        controllers: [customer_controller_1.CustomerController],
        exports: [customer_service_1.CustomerService],
        providers: [customer_service_1.CustomerService],
        imports: [CustomerModule_1, shared_module_1.SharedModule],
    })
], CustomerModule);
exports.CustomerModule = CustomerModule;
//# sourceMappingURL=customer.module.js.map