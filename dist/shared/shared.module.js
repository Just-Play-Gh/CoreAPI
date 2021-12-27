"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SharedModule = void 0;
const common_1 = require("@nestjs/common");
const axios_1 = require("@nestjs/axios");
const jwt_1 = require("@nestjs/jwt");
const passport_1 = require("@nestjs/passport");
const config_1 = require("@nestjs/config");
const customer_service_1 = require("../customer/customer.service");
const product_service_1 = require("../product/product.service");
const invoice_service_1 = require("../invoice/invoice.service");
const driver_service_1 = require("../driver/driver.service");
const notification_module_1 = require("../notification/notification.module");
const role_module_1 = require("../role/role.module");
const permission_module_1 = require("../permission/permission.module");
let SharedModule = class SharedModule {
};
SharedModule = __decorate([
    (0, common_1.Module)({
        imports: [
            common_1.CacheModule.register(),
            axios_1.HttpModule,
            passport_1.PassportModule,
            jwt_1.JwtModule.registerAsync({
                imports: [config_1.ConfigModule],
                useFactory: async () => ({
                    secret: process.env.JWT_SECRET,
                }),
                inject: [config_1.ConfigService],
            }),
            notification_module_1.NotificationModule,
            role_module_1.RoleModule,
            permission_module_1.PermissionModule,
        ],
        providers: [customer_service_1.CustomerService, driver_service_1.DriverService, product_service_1.ProductService, invoice_service_1.InvoiceService],
        exports: [
            passport_1.PassportModule,
            jwt_1.JwtModule,
            customer_service_1.CustomerService,
            driver_service_1.DriverService,
            product_service_1.ProductService,
            invoice_service_1.InvoiceService,
            notification_module_1.NotificationModule,
            role_module_1.RoleModule,
            permission_module_1.PermissionModule,
            common_1.CacheModule,
        ],
    })
], SharedModule);
exports.SharedModule = SharedModule;
//# sourceMappingURL=shared.module.js.map