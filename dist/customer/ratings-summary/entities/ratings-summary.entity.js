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
exports.CustomerRatingsSummary = void 0;
const customer_entity_1 = require("../../../customer/entities/customer.entity");
const typeorm_1 = require("typeorm");
let CustomerRatingsSummary = class CustomerRatingsSummary extends typeorm_1.BaseEntity {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], CustomerRatingsSummary.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => customer_entity_1.Customer, (customer) => customer.id),
    __metadata("design:type", customer_entity_1.Customer)
], CustomerRatingsSummary.prototype, "customer", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int' }),
    __metadata("design:type", Number)
], CustomerRatingsSummary.prototype, "totalStars", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int' }),
    __metadata("design:type", Number)
], CustomerRatingsSummary.prototype, "totalCount", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], CustomerRatingsSummary.prototype, "date", void 0);
CustomerRatingsSummary = __decorate([
    (0, typeorm_1.Entity)({ name: 'customer_ratings_summary', schema: 'public' })
], CustomerRatingsSummary);
exports.CustomerRatingsSummary = CustomerRatingsSummary;
//# sourceMappingURL=ratings-summary.entity.js.map