"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderService = void 0;
const common_1 = require("@nestjs/common");
const order_entity_1 = require("./entities/order.entity");
let OrderService = class OrderService {
    async getAll() {
        return [];
    }
    async create(createOrderDto) {
        try {
            const order = order_entity_1.Order.create();
            for (const key in createOrderDto) {
                order[key] = createOrderDto[key];
            }
            order.status = order_entity_1.OrderStatusType.Pending;
            return order_entity_1.Order.save(order);
        }
        catch (error) {
            throw error;
        }
    }
    async update(id, updateOrderDto) {
        const { driverId, customerLocation } = updateOrderDto;
        const order = await order_entity_1.Order.findOne(id);
        if (!order)
            throw new common_1.HttpException('Order Not Found', common_1.HttpStatus.NOT_FOUND);
        order.driverId = driverId;
        order.customerLocation = customerLocation;
        return await order_entity_1.Order.save(order);
    }
    async acceptOrder(driverId, orderId) {
        const order = await order_entity_1.Order.findOne(orderId);
        if (!order)
            throw new common_1.HttpException('Order Not Found', common_1.HttpStatus.NOT_FOUND);
        if (!((await order.isPending()) || order.hasBeenAssigned())) {
            console.log('Driver cannot accpet this order.Order has already been assigned or is not pending anymore');
            throw new common_1.HttpException('Sorry the order has either been assigned or is not pending anymore', common_1.HttpStatus.BAD_REQUEST);
        }
        order.driverId = driverId;
        return await order_entity_1.Order.save(order);
    }
    async assignDriverToOrder(id, updateOrderDto) {
        const { driverId } = updateOrderDto;
        const order = await order_entity_1.Order.findOne(id);
        if (!order)
            throw new common_1.HttpException('Order Not Found', common_1.HttpStatus.NOT_FOUND);
        if (!(await order.isPending())) {
            throw new common_1.HttpException('You cannot reassign a driver when the order is completed or cancelled', common_1.HttpStatus.BAD_REQUEST);
        }
        order.driverId = driverId;
        return await order_entity_1.Order.save(order);
    }
};
OrderService = __decorate([
    (0, common_1.Injectable)()
], OrderService);
exports.OrderService = OrderService;
//# sourceMappingURL=order.service.js.map