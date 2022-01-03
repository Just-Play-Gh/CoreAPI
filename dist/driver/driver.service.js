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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DriverService = void 0;
const common_1 = require("@nestjs/common");
const dayjs_1 = __importDefault(require("dayjs"));
const typeorm_1 = require("typeorm");
const driver_entity_1 = require("./entities/driver.entity");
let DriverService = class DriverService {
    constructor(cacheManager) {
        this.cacheManager = cacheManager;
    }
    async updateCurrentLocation(driver, driverLocationDto) {
        const ttl = { ttl: +process.env.DRIVER_LOCATION_CACHE_TTL || 60 };
        const res = await this.cacheManager.set(driver.id.toString(), {
            driverId: driver.id,
            coordinates: driverLocationDto.coordinates,
            updatedAt: (0, dayjs_1.default)(),
        }, ttl);
        return res;
    }
    async getCurrentLocation(driver) {
        const coordinates = await this.cacheManager.get(driver.driverId.toString());
        console.log(coordinates);
        return coordinates;
    }
    async updateProfileDto(updateProfileDto, user) {
        const driver = await (0, typeorm_1.getRepository)(driver_entity_1.Driver).findOne({
            where: { id: user.id },
        });
        console.log('setting you', updateProfileDto, driver, user.id);
        for (const key in updateProfileDto) {
            driver[key] = updateProfileDto[key];
        }
        console.log('set', driver, updateProfileDto);
        return await driver.save();
    }
};
DriverService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(common_1.CACHE_MANAGER)),
    __metadata("design:paramtypes", [Object])
], DriverService);
exports.DriverService = DriverService;
//# sourceMappingURL=driver.service.js.map