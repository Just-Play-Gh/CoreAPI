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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseController = void 0;
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const permission_guard_1 = require("../guards/permission-guard");
let BaseController = class BaseController {
    constructor(service) {
        this.service = service;
    }
    set dtos(dtos) {
        this._dtos = dtos;
    }
    get dtos() {
        return this._dtos;
    }
    set permissions(permissions) {
        this._permissions = permissions;
    }
    get permissions() {
        return this._permissions;
    }
    async getAll(query) {
        return this.service.getAll(query);
    }
    async getByColumns(query) {
        return this.service.getByColumns(query);
    }
    async getOne(param, query) {
        return this.service.getOne(param, query);
    }
    async store(createData, query) {
        var _a;
        return this.service.store(createData, query, (_a = this.dtos) === null || _a === void 0 ? void 0 : _a.store);
    }
    async update(createData, query, param) {
        var _a;
        return this.service.update(param, createData, query, (_a = this.dtos) === null || _a === void 0 ? void 0 : _a.update);
    }
    async delete(param) {
        return this.service.delete(param);
    }
};
__decorate([
    (0, common_1.Get)(),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt'), permission_guard_1.PermissionGuard),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], BaseController.prototype, "getAll", null);
__decorate([
    (0, common_1.Get)('/findByColumns'),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], BaseController.prototype, "getByColumns", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], BaseController.prototype, "getOne", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], BaseController.prototype, "store", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Query)()),
    __param(2, (0, common_1.Param)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", Promise)
], BaseController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], BaseController.prototype, "delete", null);
BaseController = __decorate([
    (0, common_1.Controller)(),
    __metadata("design:paramtypes", [Object])
], BaseController);
exports.BaseController = BaseController;
//# sourceMappingURL=base.controller.js.map