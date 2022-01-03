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
exports.Product = void 0;
const tax_entity_1 = require("../../tax/entities/tax.entity");
const typeorm_1 = require("typeorm");
var ProductStatusType;
(function (ProductStatusType) {
    ProductStatusType["Active"] = "active";
    ProductStatusType["Inactive"] = "inactive";
})(ProductStatusType || (ProductStatusType = {}));
let Product = class Product extends typeorm_1.BaseEntity {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Product.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 20, unique: true }),
    __metadata("design:type", String)
], Product.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 200, nullable: true }),
    __metadata("design:type", String)
], Product.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'double', precision: 6, scale: 3 }),
    __metadata("design:type", Number)
], Product.prototype, "pricePerLitre", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: ProductStatusType,
        default: ProductStatusType.Active,
    }),
    __metadata("design:type", String)
], Product.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Product.prototype, "created", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], Product.prototype, "updated", void 0);
__decorate([
    (0, typeorm_1.ManyToMany)(() => tax_entity_1.Tax),
    (0, typeorm_1.JoinTable)({ name: 'product_taxes' }),
    __metadata("design:type", Array)
], Product.prototype, "taxes", void 0);
Product = __decorate([
    (0, typeorm_1.Entity)({ name: 'products', schema: 'public' })
], Product);
exports.Product = Product;
//# sourceMappingURL=product.entity.js.map