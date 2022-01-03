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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Review = exports.ReviewType = void 0;
const typeorm_1 = require("typeorm");
const dayjs_1 = __importDefault(require("dayjs"));
var ReviewType;
(function (ReviewType) {
    ReviewType["Customer"] = "customer";
    ReviewType["Driver"] = "driver";
})(ReviewType = exports.ReviewType || (exports.ReviewType = {}));
let Review = class Review extends typeorm_1.BaseEntity {
    getDate() {
        this.createdDate = (0, dayjs_1.default)().format('YYYY-MM-DD');
    }
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Review.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Index)('custId-idx'),
    (0, typeorm_1.Column)({ length: 11 }),
    __metadata("design:type", String)
], Review.prototype, "customerId", void 0);
__decorate([
    (0, typeorm_1.Index)('drivId-idx'),
    (0, typeorm_1.Column)({ length: 11 }),
    __metadata("design:type", String)
], Review.prototype, "driverId", void 0);
__decorate([
    (0, typeorm_1.Index)('inv-idx'),
    (0, typeorm_1.Column)({ length: 11, nullable: true }),
    __metadata("design:type", String)
], Review.prototype, "invoiceId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], Review.prototype, "customerReview", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], Review.prototype, "driverReview", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], Review.prototype, "stars", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Review.prototype, "createdDate", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Review.prototype, "created", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], Review.prototype, "updated", void 0);
__decorate([
    (0, typeorm_1.BeforeInsert)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], Review.prototype, "getDate", null);
Review = __decorate([
    (0, typeorm_1.Entity)({ name: 'reviews', schema: 'public' })
], Review);
exports.Review = Review;
//# sourceMappingURL=review.entity.js.map