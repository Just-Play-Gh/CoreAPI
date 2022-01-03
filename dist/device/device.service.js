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
exports.DeviceService = void 0;
const common_1 = require("@nestjs/common");
const nestjs_typeorm_paginate_1 = require("nestjs-typeorm-paginate");
const base_service_1 = require("../resources/base.service");
const typeorm_1 = require("typeorm");
const device_entity_1 = require("./entities/device.entity");
let DeviceService = class DeviceService extends base_service_1.BaseService {
    constructor() {
        super(device_entity_1.Device);
    }
    async store(createDeviceDto, customer) {
        try {
            const device = await device_entity_1.Device.create(createDeviceDto);
            device.customerId = customer.id;
            device.alias = device.name;
            return await device_entity_1.Device.save(device);
        }
        catch (error) {
            if (error.code === 'ER_DUP_ENTRY') {
                throw new common_1.HttpException('Record already exists', common_1.HttpStatus.UNPROCESSABLE_ENTITY);
            }
            throw error;
        }
    }
    async getDevices(options, filter = {}) {
        const deviceRepository = (0, typeorm_1.createQueryBuilder)(device_entity_1.Device)
            .where(filter)
            .orderBy({ created: 'DESC' });
        const orders = await (0, nestjs_typeorm_paginate_1.paginate)(deviceRepository, options);
        if (!orders['items'])
            throw new common_1.HttpException('No devices were found', common_1.HttpStatus.NOT_FOUND);
        return orders;
    }
};
DeviceService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], DeviceService);
exports.DeviceService = DeviceService;
//# sourceMappingURL=device.service.js.map