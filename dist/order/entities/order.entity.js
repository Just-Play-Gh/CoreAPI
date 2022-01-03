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
exports.Order = exports.OrderStatusType = void 0;
const customer_entity_1 = require("../../customer/entities/customer.entity");
const driver_entity_1 = require("../../driver/entities/driver.entity");
const typeorm_1 = require("typeorm");
const order_logs_entity_1 = require("./order-logs.entity");
var OrderStatusType;
(function (OrderStatusType) {
    OrderStatusType["Pending"] = "pending";
    OrderStatusType["Completed"] = "completed";
    OrderStatusType["Cancelled"] = "cancelled";
})(OrderStatusType = exports.OrderStatusType || (exports.OrderStatusType = {}));
let Order = class Order extends typeorm_1.BaseEntity {
    async cancel() {
        this.status = OrderStatusType.Cancelled;
        return this.save();
    }
    async isPending() {
        return this.status === OrderStatusType.Pending;
    }
    async hasBeenAssigned() {
        return this.driverId !== null;
    }
    async createLog(message) {
        return order_logs_entity_1.OrderLog.create({
            orderId: this.id,
            message: message,
        }).save();
    }
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Order.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Index)('invoice-idx'),
    (0, typeorm_1.Column)({ length: 20 }),
    __metadata("design:type", String)
], Order.prototype, "orderId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'double', precision: 6, scale: 3 }),
    __metadata("design:type", Number)
], Order.prototype, "pricePerLitre", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'double', precision: 18, scale: 2 }),
    __metadata("design:type", Number)
], Order.prototype, "amount", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'double', precision: 18, scale: 2 }),
    __metadata("design:type", Number)
], Order.prototype, "totalAmount", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'json', nullable: true }),
    __metadata("design:type", Array)
], Order.prototype, "taxes", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 100 }),
    __metadata("design:type", String)
], Order.prototype, "customerFullName", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 15, nullable: true }),
    __metadata("design:type", String)
], Order.prototype, "channel", void 0);
__decorate([
    (0, typeorm_1.Index)('transId-idx'),
    (0, typeorm_1.Column)({ length: 40, nullable: true }),
    __metadata("design:type", String)
], Order.prototype, "channelTransactionId", void 0);
__decorate([
    (0, typeorm_1.Index)('custId-idx'),
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Order.prototype, "customerId", void 0);
__decorate([
    (0, typeorm_1.Index)('drivId-idx'),
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Order.prototype, "driverId", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Order.prototype, "latlong", void 0);
__decorate([
    (0, typeorm_1.Index)('status-idx'),
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: OrderStatusType,
        default: OrderStatusType.Pending,
    }),
    __metadata("design:type", String)
], Order.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Order.prototype, "created", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], Order.prototype, "updated", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => driver_entity_1.Driver, (driver) => driver.id),
    __metadata("design:type", driver_entity_1.Driver)
], Order.prototype, "driver", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => customer_entity_1.Customer, (customer) => customer.id),
    __metadata("design:type", customer_entity_1.Customer)
], Order.prototype, "customer", void 0);
Order = __decorate([
    (0, typeorm_1.Entity)({ name: 'orders', schema: 'public' })
], Order);
exports.Order = Order;
//# sourceMappingURL=order.entity.js.map