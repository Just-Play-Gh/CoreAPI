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
exports.DeviceController = void 0;
const common_1 = require("@nestjs/common");
const current_user_decorator_1 = require("../decorators/current-user.decorator");
const jwt_auth_guard_1 = require("../guards/jwt-auth.guard");
const get_order_dto_1 = require("../order/dto/get-order.dto");
const base_controller_1 = require("../resources/base.controller");
const device_service_1 = require("./device.service");
const create_device_dto_1 = require("./dto/create-device.dto");
const update_device_dto_1 = require("./dto/update-device.dto");
let DeviceController = class DeviceController extends base_controller_1.BaseController {
    constructor(deviceService) {
        super(deviceService);
        this.deviceService = deviceService;
        this.dtos = { store: create_device_dto_1.CreateDeviceDto, update: update_device_dto_1.UpdateDeviceDto };
    }
    async getDevicesForCustomer(customer, page = 1, limit = 15, getDevice) {
        delete getDevice.page;
        delete getDevice.limit;
        return this.deviceService.getDevices({ page, limit }, { customerId: customer.id });
    }
};
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)(),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Query)('page', new common_1.DefaultValuePipe(1), common_1.ParseIntPipe)),
    __param(2, (0, common_1.Query)('limit', new common_1.DefaultValuePipe(15), common_1.ParseIntPipe)),
    __param(3, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object, get_order_dto_1.GetOrderDto]),
    __metadata("design:returntype", Promise)
], DeviceController.prototype, "getDevicesForCustomer", null);
DeviceController = __decorate([
    (0, common_1.Controller)('devices'),
    __metadata("design:paramtypes", [device_service_1.DeviceService])
], DeviceController);
exports.DeviceController = DeviceController;
//# sourceMappingURL=device.controller.js.map