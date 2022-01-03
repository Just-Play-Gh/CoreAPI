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
exports.DriverController = void 0;
const common_1 = require("@nestjs/common");
const current_user_decorator_1 = require("../decorators/current-user.decorator");
const jwt_auth_guard_1 = require("../guards/jwt-auth.guard");
const driver_service_1 = require("./driver.service");
const get_driver_location_dto_1 = require("./dto/get-driver-location.dto");
const update_driver_location_dto_1 = require("./dto/update-driver-location.dto");
const driver_entity_1 = require("./entities/driver.entity");
let DriverController = class DriverController {
    constructor(driverService) {
        this.driverService = driverService;
    }
    async pingCurrentLocation(driver, driverLocationDto) {
        const coordinates = await this.driverService.updateCurrentLocation(driver, driverLocationDto);
        return coordinates;
    }
    async getCurrentLocation(getDriverLocationDto) {
        const coordinates = await this.driverService.getCurrentLocation(getDriverLocationDto);
        return coordinates;
    }
    async oauthLogin(updateProfileDto, user) {
        return this.driverService.updateProfileDto(updateProfileDto, user);
    }
};
__decorate([
    (0, common_1.Post)('location'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, update_driver_location_dto_1.UpdateDriverLocationDto]),
    __metadata("design:returntype", Promise)
], DriverController.prototype, "pingCurrentLocation", null);
__decorate([
    (0, common_1.Get)('location'),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [get_driver_location_dto_1.GetDriverLocationDto]),
    __metadata("design:returntype", Promise)
], DriverController.prototype, "getCurrentLocation", null);
__decorate([
    (0, common_1.Patch)('/update-profile'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, driver_entity_1.Driver]),
    __metadata("design:returntype", Promise)
], DriverController.prototype, "oauthLogin", null);
DriverController = __decorate([
    (0, common_1.Controller)('drivers'),
    __metadata("design:paramtypes", [driver_service_1.DriverService])
], DriverController);
exports.DriverController = DriverController;
//# sourceMappingURL=driver.controller.js.map