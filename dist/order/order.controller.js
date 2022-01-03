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
exports.OrderController = void 0;
const common_1 = require("@nestjs/common");
const current_user_decorator_1 = require("../decorators/current-user.decorator");
const jwt_auth_guard_1 = require("../guards/jwt-auth.guard");
const base_controller_1 = require("../resources/base.controller");
const create_order_dto_1 = require("./dto/create-order.dto");
const get_order_dto_1 = require("./dto/get-order.dto");
const update_order_dto_1 = require("./dto/update-order.dto");
const order_service_1 = require("./order.service");
let OrderController = class OrderController extends base_controller_1.BaseController {
    constructor(orderService) {
        super(orderService);
        this.orderService = orderService;
        this.dtos = { store: create_order_dto_1.CreateOrderDto, update: update_order_dto_1.UpdateOrderDto };
    }
    async store(customer, body) {
        return this.orderService.store(body, customer);
    }
    async getOrdersForCustomer(customer, page = 1, limit = 15, getOrders) {
        delete getOrders.page;
        delete getOrders.limit;
        return this.orderService.getOrders({ page, limit }, { customerId: customer.id });
    }
    async getOrdersForDriver(driver, page = 1, limit = 15, getOrders) {
        delete getOrders.page;
        delete getOrders.limit;
        return this.orderService.getOrders({ page, limit }, { driverId: driver.id });
    }
    async acceptOrder(driver, id) {
        return this.orderService.acceptOrder(driver, id);
    }
    async cancelOrder(customer, id) {
        return this.orderService.cancelOrder(id, customer);
    }
    async getOrderLogs(orderId) {
        return await this.orderService.getOrderLogs(orderId);
    }
};
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Post)(),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], OrderController.prototype, "store", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)('/customer'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Query)('page', new common_1.DefaultValuePipe(1), common_1.ParseIntPipe)),
    __param(2, (0, common_1.Query)('limit', new common_1.DefaultValuePipe(15), common_1.ParseIntPipe)),
    __param(3, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object, get_order_dto_1.GetOrderDto]),
    __metadata("design:returntype", Promise)
], OrderController.prototype, "getOrdersForCustomer", null);
__decorate([
    (0, common_1.Get)('/driver'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Query)('page', new common_1.DefaultValuePipe(1), common_1.ParseIntPipe)),
    __param(2, (0, common_1.Query)('limit', new common_1.DefaultValuePipe(15), common_1.ParseIntPipe)),
    __param(3, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object, get_order_dto_1.GetOrderDto]),
    __metadata("design:returntype", Promise)
], OrderController.prototype, "getOrdersForDriver", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)(':id/accept'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], OrderController.prototype, "acceptOrder", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Patch)(':id/cancel'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], OrderController.prototype, "cancelOrder", null);
__decorate([
    (0, common_1.Get)(':id/logs'),
    __param(0, (0, common_1.Param)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], OrderController.prototype, "getOrderLogs", null);
OrderController = __decorate([
    (0, common_1.Controller)('orders'),
    __metadata("design:paramtypes", [order_service_1.OrderService])
], OrderController);
exports.OrderController = OrderController;
//# sourceMappingURL=order.controller.js.map