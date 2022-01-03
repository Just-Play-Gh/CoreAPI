"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Customer = exports.StatusType = exports.ProviderType = void 0;
const typeorm_1 = require("typeorm");
const bcrypt = __importStar(require("bcrypt"));
const class_transformer_1 = require("class-transformer");
const order_entity_1 = require("../../order/entities/order.entity");
const review_summary_entity_1 = require("../../reviews/review-summary/entities/review_summary.entity");
const generator_1 = require("../../helpers/generator");
var ProviderType;
(function (ProviderType) {
    ProviderType["Default"] = "default";
    ProviderType["Google"] = "google";
    ProviderType["Apple"] = "apple";
})(ProviderType = exports.ProviderType || (exports.ProviderType = {}));
var StatusType;
(function (StatusType) {
    StatusType["Active"] = "1";
    StatusType["Inactive"] = "0";
})(StatusType = exports.StatusType || (exports.StatusType = {}));
let Customer = class Customer extends typeorm_1.BaseEntity {
    async hashPassword() {
        if (this.password) {
            this.password = await bcrypt.hash(this.password, 8);
        }
    }
    generateReferralCode() {
        this.referralCode = (0, generator_1.generatePassword)(8).toUpperCase();
    }
    async validatePassword(password) {
        return await bcrypt.compare(password, this.password);
    }
    async getFullName() {
        return this.firstName + ' ' + this.lastName;
    }
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Customer.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 50 }),
    __metadata("design:type", String)
], Customer.prototype, "firstName", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 50 }),
    __metadata("design:type", String)
], Customer.prototype, "lastName", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 90, unique: true, nullable: true }),
    __metadata("design:type", String)
], Customer.prototype, "email", void 0);
__decorate([
    (0, typeorm_1.Index)('provider-typex'),
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: ProviderType,
        default: ProviderType.Default,
    }),
    __metadata("design:type", String)
], Customer.prototype, "provider", void 0);
__decorate([
    (0, typeorm_1.Index)('provider-idx'),
    (0, typeorm_1.Column)({ length: 150, nullable: true }),
    __metadata("design:type", String)
], Customer.prototype, "providerId", void 0);
__decorate([
    (0, typeorm_1.Index)('phone-number-idx'),
    (0, typeorm_1.Column)({ length: 15, unique: true, nullable: true }),
    __metadata("design:type", String)
], Customer.prototype, "phoneNumber", void 0);
__decorate([
    (0, typeorm_1.Index)('country-idx'),
    (0, typeorm_1.Column)({ length: 56, nullable: true }),
    __metadata("design:type", String)
], Customer.prototype, "country", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 30, nullable: true }),
    __metadata("design:type", String)
], Customer.prototype, "referralCode", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    (0, class_transformer_1.Exclude)(),
    __metadata("design:type", String)
], Customer.prototype, "password", void 0);
__decorate([
    (0, typeorm_1.Index)('status-typex'),
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: StatusType,
        default: StatusType.Active,
    }),
    __metadata("design:type", String)
], Customer.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Customer.prototype, "created", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], Customer.prototype, "updated", void 0);
__decorate([
    (0, typeorm_1.Index)('email-verify-idx'),
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Date)
], Customer.prototype, "emailVerifiedAt", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => order_entity_1.Order, (order) => order.driver),
    __metadata("design:type", Array)
], Customer.prototype, "orders", void 0);
__decorate([
    (0, typeorm_1.BeforeInsert)(),
    (0, typeorm_1.BeforeUpdate)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], Customer.prototype, "hashPassword", null);
__decorate([
    (0, typeorm_1.BeforeInsert)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], Customer.prototype, "generateReferralCode", null);
__decorate([
    (0, typeorm_1.OneToOne)(() => review_summary_entity_1.ReviewSummary, (summary) => summary.customerId),
    __metadata("design:type", Customer)
], Customer.prototype, "ratings_summary", void 0);
Customer = __decorate([
    (0, typeorm_1.Entity)({ name: 'customers', schema: 'public' })
], Customer);
exports.Customer = Customer;
//# sourceMappingURL=customer.entity.js.map