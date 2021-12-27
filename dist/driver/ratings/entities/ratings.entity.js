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
exports.DriverRatings = void 0;
const driver_entity_1 = require("../../../driver/entities/driver.entity");
const typeorm_1 = require("typeorm");
let DriverRatings = class DriverRatings extends typeorm_1.BaseEntity {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], DriverRatings.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => driver_entity_1.Driver, (driver) => driver.id),
    __metadata("design:type", driver_entity_1.Driver)
], DriverRatings.prototype, "driver", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int' }),
    __metadata("design:type", Number)
], DriverRatings.prototype, "star", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], DriverRatings.prototype, "created", void 0);
DriverRatings = __decorate([
    (0, typeorm_1.Entity)({ name: 'driver_ratings', schema: 'public' })
], DriverRatings);
exports.DriverRatings = DriverRatings;
//# sourceMappingURL=ratings.entity.js.map