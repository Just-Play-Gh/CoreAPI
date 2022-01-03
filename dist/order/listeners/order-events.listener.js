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
exports.OrderEventListeners = void 0;
const common_1 = require("@nestjs/common");
const event_emitter_1 = require("@nestjs/event-emitter");
const app_gateway_1 = require("../../app.gateway");
const order_accepted_event_1 = require("../events/order-accepted.event");
const order_created_event_1 = require("../events/order-created.event");
let OrderEventListeners = class OrderEventListeners {
    constructor(appGateway) {
        this.appGateway = appGateway;
    }
    handleOrderCreated(event) {
        this.appGateway.server.emit(`${event.customerId}_order`, event);
        console.log(event);
    }
    handleOrderAccepted(event) {
        this.appGateway.server.emit(`${event.customerId}_order`, event);
        console.log(event);
    }
};
__decorate([
    (0, event_emitter_1.OnEvent)('order.created'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [order_created_event_1.OrderCreatedEvent]),
    __metadata("design:returntype", void 0)
], OrderEventListeners.prototype, "handleOrderCreated", null);
__decorate([
    (0, event_emitter_1.OnEvent)('order.accepted'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [order_accepted_event_1.OrderAcceptedEvent]),
    __metadata("design:returntype", void 0)
], OrderEventListeners.prototype, "handleOrderAccepted", null);
OrderEventListeners = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [app_gateway_1.AppGateway])
], OrderEventListeners);
exports.OrderEventListeners = OrderEventListeners;
//# sourceMappingURL=order-events.listener.js.map