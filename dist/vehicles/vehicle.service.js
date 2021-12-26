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
exports.VehicleService = void 0;
const axios_1 = require("@nestjs/axios");
const common_1 = require("@nestjs/common");
const rxjs_1 = require("rxjs");
const typeorm_1 = require("typeorm");
const make_entity_1 = require("./entities/make.entity");
const vehicleModels_entity_1 = require("./entities/vehicleModels.entity");
let VehicleService = class VehicleService {
    constructor(httpService) {
        this.httpService = httpService;
    }
    async getAllMake() {
        return await make_entity_1.AllMakes.find({ ranking: make_entity_1.RankingType.popular });
    }
    async searchMake(searchDto) {
        const searchKey = { searchDto };
        return await make_entity_1.AllMakes.getRepository()
            .createQueryBuilder()
            .where('makeName like :name', { name: `%${searchKey}%` })
            .getMany();
    }
    async insertModel() {
        const makes = await make_entity_1.AllMakes.find();
        for (const element of makes) {
            try {
                this.sleep(200);
                const url = `${process.env.VEHICLE_SERVICE_API_URL}/vehicles/GetModelsForMakeId/${element.id}?format=json`;
                const response = await (0, rxjs_1.lastValueFrom)(this.httpService.get(url).pipe((0, rxjs_1.map)((res) => res.data)));
                if (response.Count > 0) {
                    const insertValue = response.Results.map((item) => {
                        return {
                            id: item.Model_ID,
                            modelName: item.Model_Name,
                            makeId: item.Make_ID,
                        };
                    });
                    await (0, typeorm_1.getConnection)()
                        .createQueryBuilder()
                        .insert()
                        .into(vehicleModels_entity_1.VehicleModels)
                        .values(insertValue)
                        .orIgnore(true)
                        .execute();
                }
            }
            catch (error) {
                console.log(error);
            }
        }
        return 'success';
    }
    sleep(ms) {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }
};
VehicleService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [axios_1.HttpService])
], VehicleService);
exports.VehicleService = VehicleService;
//# sourceMappingURL=vehicle.service.js.map