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
exports.Tax = exports.TaxType = void 0;
const index_1 = require("../../types/index");
const typeorm_1 = require("typeorm");
var TaxType;
(function (TaxType) {
    TaxType["Fixed"] = "fixed";
    TaxType["Percentage"] = "percentage";
})(TaxType = exports.TaxType || (exports.TaxType = {}));
let Tax = class Tax extends typeorm_1.BaseEntity {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Tax.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: TaxType,
        default: TaxType.Percentage,
    }),
    __metadata("design:type", String)
], Tax.prototype, "type", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 200, nullable: true }),
    __metadata("design:type", String)
], Tax.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 4, scale: 2 }),
    __metadata("design:type", Number)
], Tax.prototype, "value", void 0);
__decorate([
    (0, typeorm_1.Index)('status-typex'),
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: index_1.StatusType,
        default: index_1.StatusType.Active,
    }),
    __metadata("design:type", String)
], Tax.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Tax.prototype, "created", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], Tax.prototype, "updated", void 0);
Tax = __decorate([
    (0, typeorm_1.Entity)({ name: 'taxes', schema: 'public' })
], Tax);
exports.Tax = Tax;
//# sourceMappingURL=tax.entity.js.map