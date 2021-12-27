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
exports.Invoice = exports.InvoiceStatusType = void 0;
const typeorm_1 = require("typeorm");
var InvoiceStatusType;
(function (InvoiceStatusType) {
    InvoiceStatusType["Pending"] = "pending";
    InvoiceStatusType["Processing"] = "processing";
    InvoiceStatusType["Failed"] = "failed";
    InvoiceStatusType["Paid"] = "paid";
})(InvoiceStatusType = exports.InvoiceStatusType || (exports.InvoiceStatusType = {}));
let Invoice = class Invoice extends typeorm_1.BaseEntity {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Invoice.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Index)('invoice-idx'),
    (0, typeorm_1.Column)({ length: 20 }),
    __metadata("design:type", String)
], Invoice.prototype, "invoiceNumber", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'double', precision: 6, scale: 3 }),
    __metadata("design:type", Number)
], Invoice.prototype, "pricePerLitre", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'double', precision: 18, scale: 2 }),
    __metadata("design:type", Number)
], Invoice.prototype, "totalAmount", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'json' }),
    __metadata("design:type", Array)
], Invoice.prototype, "taxes", void 0);
__decorate([
    (0, typeorm_1.Index)('status-idx'),
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: InvoiceStatusType,
        default: InvoiceStatusType.Pending,
    }),
    __metadata("design:type", String)
], Invoice.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 100 }),
    __metadata("design:type", String)
], Invoice.prototype, "customerFullName", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 15, nullable: true }),
    __metadata("design:type", String)
], Invoice.prototype, "channel", void 0);
__decorate([
    (0, typeorm_1.Index)('transId-idx'),
    (0, typeorm_1.Column)({ length: 40, nullable: true }),
    __metadata("design:type", String)
], Invoice.prototype, "channelTransactionId", void 0);
__decorate([
    (0, typeorm_1.Index)('custNumber-idx'),
    (0, typeorm_1.Column)({ length: 15 }),
    __metadata("design:type", String)
], Invoice.prototype, "customerPhoneNumber", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Invoice.prototype, "created", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], Invoice.prototype, "updated", void 0);
Invoice = __decorate([
    (0, typeorm_1.Entity)({ name: 'invoices', schema: 'public' })
], Invoice);
exports.Invoice = Invoice;
//# sourceMappingURL=invoice.entity.js.map