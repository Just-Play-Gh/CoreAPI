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
exports.OrderLog = exports.OrderLogEventMessages = void 0;
const typeorm_1 = require("typeorm");
var OrderLogEventMessages;
(function (OrderLogEventMessages) {
    OrderLogEventMessages["Created"] = "Looking for the closest driver.";
    OrderLogEventMessages["Accepted"] = "A driver has accepted the request and is on their way to you.";
    OrderLogEventMessages["Assigned"] = "A driver has been assigned to your order.";
    OrderLogEventMessages["Cancelled"] = "Order has been cancelled.";
})(OrderLogEventMessages = exports.OrderLogEventMessages || (exports.OrderLogEventMessages = {}));
let OrderLog = class OrderLog extends typeorm_1.BaseEntity {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], OrderLog.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Index)('orderLogsInv-idx'),
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], OrderLog.prototype, "orderId", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 280 }),
    __metadata("design:type", String)
], OrderLog.prototype, "message", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], OrderLog.prototype, "created", void 0);
OrderLog = __decorate([
    (0, typeorm_1.Entity)({ name: 'order_logs', schema: 'public' })
], OrderLog);
exports.OrderLog = OrderLog;
//# sourceMappingURL=order-logs.entity.js.map