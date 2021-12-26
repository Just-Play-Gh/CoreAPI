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
exports.InvoiceService = void 0;
const common_1 = require("@nestjs/common");
const product_service_1 = require("../product/product.service");
const invoice_entity_1 = require("./entities/invoice.entity");
let InvoiceService = class InvoiceService {
    constructor(productService) {
        this.productService = productService;
    }
    async createInvoice(createInvoiceDto, user) {
        const { productId, amount } = createInvoiceDto;
        const { firstName, lastName, phoneNumber } = user;
        const product = null;
        if (!product)
            throw new common_1.HttpException('Product Not Found', common_1.HttpStatus.NOT_FOUND);
        const invoice = invoice_entity_1.Invoice.create();
        invoice.invoiceNumber = new Date().toISOString().replace(/\D/g, '');
        invoice.customerFullName = `${firstName} ${lastName}`;
        invoice.customerPhoneNumber = phoneNumber;
        invoice.pricePerLitre = await product.pricePerLitre;
        invoice.taxes = product.taxes;
        invoice.totalAmount = amount;
        await invoice_entity_1.Invoice.save(invoice);
        return invoice;
    }
    async updateInvoice(updateInvoiceDto, user) {
        const { invoiceId } = updateInvoiceDto;
        try {
            return await (await this.getInvoice({ invoiceId })).save(updateInvoiceDto);
        }
        catch (error) {
            console.log(error);
            throw error;
        }
    }
    async getInvoice(getInvoiceDto) {
        const { invoiceId } = getInvoiceDto;
        const invoice = await invoice_entity_1.Invoice.findOne({ id: invoiceId });
        if (!invoice)
            throw new common_1.HttpException('Invoice Not Found', common_1.HttpStatus.NOT_FOUND);
        return invoice;
    }
};
InvoiceService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [product_service_1.ProductService])
], InvoiceService);
exports.InvoiceService = InvoiceService;
//# sourceMappingURL=invoice.service.js.map