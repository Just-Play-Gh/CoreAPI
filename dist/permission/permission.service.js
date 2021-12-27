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
exports.PermissionService = void 0;
const common_1 = require("@nestjs/common");
const base_service_1 = require("../resources/base.service");
const role_entity_1 = require("../role/entity/role.entity");
const typeorm_1 = require("typeorm");
const permission_entity_1 = require("./entity/permission.entity");
let PermissionService = class PermissionService extends base_service_1.BaseService {
    constructor() {
        super(permission_entity_1.Permission);
    }
    async assignPermissionToRole(body) {
        const { permissionId, roleId } = body;
        const permissions = await (0, typeorm_1.getRepository)(permission_entity_1.Permission).find({
            where: { id: (0, typeorm_1.In)(permissionId) },
        });
        const role = await role_entity_1.Role.findOne({ id: roleId }, { relations: ['permissions'] });
        role.permissions = [];
        role.permissions = permissions;
        role.save();
        return role;
    }
    async hasPermission(permission) {
        const permissions = await (await this.getAll({})).items;
        return permissions
            .map((permission) => permission.name)
            .includes(permission);
    }
    async hasAnyPermission(permission) {
        console.log(permission);
    }
};
PermissionService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], PermissionService);
exports.PermissionService = PermissionService;
//# sourceMappingURL=permission.service.js.map