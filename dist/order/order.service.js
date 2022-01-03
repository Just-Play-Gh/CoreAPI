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
exports.OrderService = void 0;
const axios_1 = require("@nestjs/axios");
const common_1 = require("@nestjs/common");
const nestjs_typeorm_paginate_1 = require("nestjs-typeorm-paginate");
const product_entity_1 = require("../product/entities/product.entity");
const base_service_1 = require("../resources/base.service");
const typeorm_1 = require("typeorm");
const order_logs_entity_1 = require("./entities/order-logs.entity");
const order_entity_1 = require("./entities/order.entity");
const event_emitter_1 = require("@nestjs/event-emitter");
const order_created_event_1 = require("./events/order-created.event");
const order_accepted_event_1 = require("./events/order-accepted.event");
let OrderService = class OrderService extends base_service_1.BaseService {
    constructor(httpService, eventEmitter) {
        super(order_entity_1.Order);
        this.httpService = httpService;
        this.eventEmitter = eventEmitter;
    }
    async store(createOrderDto, customer) {
        if (customer.role !== 'customer') {
            throw new common_1.HttpException('You are not authorised to perform this action', common_1.HttpStatus.UNAUTHORIZED);
        }
        const product = await product_entity_1.Product.findOne({
            id: createOrderDto.productId,
        });
        if (!product) {
            console.log('Product not found');
            throw new common_1.HttpException('Product not found', common_1.HttpStatus.BAD_REQUEST);
        }
        try {
            const order = order_entity_1.Order.create(createOrderDto);
            order.status = order_entity_1.OrderStatusType.Pending;
            order.customerId = createOrderDto.customerId || customer.id;
            order.orderId = new Date().toISOString().replace(/\D/g, '');
            order.pricePerLitre = product.pricePerLitre;
            order.totalAmount = order.amount;
            order.customerFullName =
                createOrderDto.customerFullName ||
                    customer.firstName + ' ' + customer.lastName;
            const createdOrder = await order_entity_1.Order.save(order).catch((err) => {
                throw new common_1.HttpException(err.message, common_1.HttpStatus.BAD_REQUEST);
            });
            const orderCreatedEvent = new order_created_event_1.OrderCreatedEvent();
            orderCreatedEvent.latlong = order.latlong;
            orderCreatedEvent.driverId = order.driverId;
            orderCreatedEvent.customerId = order.customerId;
            this.eventEmitter.emit('order.created', orderCreatedEvent);
            createdOrder.createLog(order_logs_entity_1.OrderLogEventMessages.Created).catch((err) => {
                console.log('An error occured while creating event log');
                throw new common_1.HttpException(err.message, common_1.HttpStatus.BAD_REQUEST);
            });
            return createdOrder;
        }
        catch (error) {
            console.log('An error occured', error);
            throw new common_1.HttpException('Sorry an error occured', common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async getOrders(options, filter = {}) {
        const orderRepository = (0, typeorm_1.createQueryBuilder)(order_entity_1.Order)
            .where(filter)
            .orderBy({ created: 'DESC' });
        const orders = await (0, nestjs_typeorm_paginate_1.paginate)(orderRepository, options);
        if (!orders['items'])
            throw new common_1.HttpException('No orders were found', common_1.HttpStatus.NOT_FOUND);
        return orders;
    }
    async acceptOrder(driver, orderId) {
        if (driver.role !== 'driver') {
            throw new common_1.HttpException('Unauthorized', common_1.HttpStatus.UNAUTHORIZED);
        }
        const order = await order_entity_1.Order.findOne(orderId);
        if (!order)
            throw new common_1.HttpException('Order Not Found', common_1.HttpStatus.NOT_FOUND);
        if (!((await order.isPending()) || order.hasBeenAssigned())) {
            console.log('Driver cannot accpet this order. Order has already been assigned or is not longer available');
            throw new common_1.HttpException('Sorry the order has either been assigned or is not pending anymore', common_1.HttpStatus.BAD_REQUEST);
        }
        order.driverId = driver.id;
        const acceptedOrder = await order_entity_1.Order.save(order);
        if (acceptedOrder.driverId) {
            const orderAcceptedEvent = new order_accepted_event_1.OrderAcceptedEvent();
            orderAcceptedEvent.latlong = order.latlong;
            orderAcceptedEvent.driverId = order.driverId;
            orderAcceptedEvent.customerId = order.customerId;
            this.eventEmitter.emit('order.accepted', orderAcceptedEvent);
            acceptedOrder.createLog(order_logs_entity_1.OrderLogEventMessages.Accepted).catch((err) => {
                console.log('An error occured while creating event log', err);
            });
        }
        return acceptedOrder;
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
        const assignedOrder = await order_entity_1.Order.save(order);
        if (!assignedOrder.driverId) {
            assignedOrder.createLog(order_logs_entity_1.OrderLogEventMessages.Assigned).catch((err) => {
                console.log('An error occured while creating event log');
                throw new common_1.HttpException(err.message, common_1.HttpStatus.BAD_REQUEST);
            });
        }
        return assignedOrder;
    }
    async cancelOrder(orderId, customer) {
        const order = await order_entity_1.Order.findOne({ id: orderId.id });
        if (!order) {
            throw new common_1.HttpException('Order not found', common_1.HttpStatus.BAD_REQUEST);
        }
        if (order.customerId !== customer.id) {
            console.log(order, customer);
            throw new common_1.HttpException('Forbidden', common_1.HttpStatus.FORBIDDEN);
        }
        const cancelledOrder = await order.cancel();
        cancelledOrder.createLog(order_logs_entity_1.OrderLogEventMessages.Cancelled).catch((err) => {
            console.log('An error occured while creating event log');
            throw new common_1.HttpException(err.message, common_1.HttpStatus.BAD_REQUEST);
        });
        return cancelledOrder;
    }
    async getOrderLogs(orderId) {
        const orderLogs = await order_logs_entity_1.OrderLog.find({ orderId: orderId.id });
        return orderLogs;
    }
};
OrderService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [axios_1.HttpService,
        event_emitter_1.EventEmitter2])
], OrderService);
exports.OrderService = OrderService;
//# sourceMappingURL=order.service.js.map