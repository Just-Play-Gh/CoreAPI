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
exports.ReviewSummary = exports.ReviewType = void 0;
const typeorm_1 = require("typeorm");
var ReviewType;
(function (ReviewType) {
    ReviewType["Customer"] = "customer";
    ReviewType["Driver"] = "driver";
})(ReviewType = exports.ReviewType || (exports.ReviewType = {}));
let ReviewSummary = class ReviewSummary extends typeorm_1.BaseEntity {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], ReviewSummary.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Index)('sum-custId-idx'),
    (0, typeorm_1.Column)({ length: 11 }),
    __metadata("design:type", String)
], ReviewSummary.prototype, "customerId", void 0);
__decorate([
    (0, typeorm_1.Index)('sum-drivId-idx'),
    (0, typeorm_1.Column)({ length: 11, nullable: true }),
    __metadata("design:type", String)
], ReviewSummary.prototype, "driverId", void 0);
__decorate([
    (0, typeorm_1.Index)('sum-inv-idx'),
    (0, typeorm_1.Column)({ length: 11, nullable: true }),
    __metadata("design:type", String)
], ReviewSummary.prototype, "invoiceId", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], ReviewSummary.prototype, "totalCount", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'double' }),
    __metadata("design:type", Number)
], ReviewSummary.prototype, "rating", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], ReviewSummary.prototype, "totalStars", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], ReviewSummary.prototype, "created", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], ReviewSummary.prototype, "updated", void 0);
ReviewSummary = __decorate([
    (0, typeorm_1.Entity)({ name: 'review_summaries', schema: 'public' })
], ReviewSummary);
exports.ReviewSummary = ReviewSummary;
//# sourceMappingURL=review_summary.entity.js.map