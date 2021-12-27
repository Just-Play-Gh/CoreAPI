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
exports.TaxController = void 0;
const common_1 = require("@nestjs/common");
const base_controller_1 = require("../resources/base.controller");
const create_tax_dto_1 = require("./dto/create-tax.dto");
const tax_service_1 = require("./tax.service");
let TaxController = class TaxController extends base_controller_1.BaseController {
    constructor(taxService) {
        super(taxService);
        this.taxService = taxService;
        this.dtos = { store: create_tax_dto_1.CreateTaxDto };
    }
};
TaxController = __decorate([
    (0, common_1.Controller)('taxes'),
    __metadata("design:paramtypes", [tax_service_1.TaxService])
], TaxController);
exports.TaxController = TaxController;
//# sourceMappingURL=tax.controller.js.map