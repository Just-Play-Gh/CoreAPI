"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const customer_module_1 = require("./customer/customer.module");
const database_module_1 = require("./database/database.module");
const config_1 = require("@nestjs/config");
const callback_module_1 = require("./callback/callback.module");
const order_module_1 = require("./order/order.module");
const shared_module_1 = require("./shared/shared.module");
const invoice_module_1 = require("./invoice/invoice.module");
const review_module_1 = require("./review/review.module");
const driver_module_1 = require("./driver/driver.module");
const authentication_module_1 = require("./authentication/authentication.module");
const notification_module_1 = require("./notification/notification.module");
const users_module_1 = require("./users/users.module");
const jwt_strategy_1 = require("./authentication/jwt.strategy");
const tax_module_1 = require("./tax/tax.module");
const role_controller_1 = require("./role/role.controller");
const vehicle_module_1 = require("./vehicles/vehicle.module");
const device_module_1 = require("./device/device.module");
let AppModule = class AppModule {
};
AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            driver_module_1.DriverModule,
            customer_module_1.CustomerModule,
            config_1.ConfigModule.forRoot({
                isGlobal: true,
            }),
            database_module_1.DatabaseModule,
            users_module_1.UsersModule,
            shared_module_1.SharedModule,
            invoice_module_1.InvoiceModule,
            callback_module_1.CallbackModule,
            order_module_1.OrderModule,
            review_module_1.ReviewModule,
            authentication_module_1.AuthenticationModule,
            notification_module_1.NotificationModule,
            tax_module_1.TaxModule,
            vehicle_module_1.VehicleModule,
            device_module_1.DeviceModule,
        ],
        controllers: [app_controller_1.AppController, role_controller_1.RoleController],
        providers: [app_service_1.AppService, jwt_strategy_1.JwtStrategy],
    })
], AppModule);
exports.AppModule = AppModule;
//# sourceMappingURL=app.module.js.map