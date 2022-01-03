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
exports.BaseService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("typeorm");
const validator_1 = require("../helpers/validator");
const nestjs_typeorm_paginate_1 = require("nestjs-typeorm-paginate");
let BaseService = class BaseService {
    constructor(entity) {
        this.entity = entity;
    }
    async getAll(query) {
        const { limit = 10, page = 1 } = query;
        const builder = await this.prepareBuilder(query);
        const results = await (0, nestjs_typeorm_paginate_1.paginate)(builder, {
            limit,
            page,
        });
        return results;
    }
    async getOne(param, query) {
        const { id } = param;
        const builder = await this.prepareBuilder(query);
        if (id) {
            await builder.andWhere(`entity.id = :id`, { id });
        }
        await this.fetchByColumns(query, builder);
        const results = await builder.getOne();
        if (!results)
            throw new common_1.HttpException('Not Found', common_1.HttpStatus.NOT_FOUND);
        return results;
    }
    async getByColumns(query) {
        const builder = await this.prepareBuilder(query);
        this.fetchByColumns(query, builder);
        const results = await builder.getMany();
        return results;
    }
    async store(body, query, storeDto) {
        try {
            if (storeDto) {
                const validDto = await (0, validator_1.validateDto)(new storeDto(), body);
                if (Object.keys(validDto).length > 0)
                    throw new common_1.HttpException(validDto, common_1.HttpStatus.BAD_REQUEST);
            }
            return await this.entity.save(this.entity.create(body));
        }
        catch (error) {
            if (error.code === 'ER_DUP_ENTRY') {
                throw new common_1.HttpException('Record already exists', common_1.HttpStatus.UNPROCESSABLE_ENTITY);
            }
            throw error;
        }
    }
    async update(param, body, query, updateDto) {
        const { id } = param;
        if (updateDto) {
            const validDto = await (0, validator_1.validateDto)(new updateDto(), body);
            if (Object.keys(validDto).length > 0)
                throw new common_1.HttpException(validDto, common_1.HttpStatus.BAD_REQUEST);
        }
        await (await this.getQueryBuilder())
            .update(this.entity)
            .set(body)
            .where('id = :id', { id })
            .execute();
        const builder = await this.prepareBuilder(query);
        await builder.where(`entity.id = :id`, { id });
        const results = await builder.getOne();
        return results;
    }
    async delete(param) {
        const { id } = param;
        const builder = await this.prepareBuilder({});
        await builder.where(`entity.id = :id`, { id });
        const results = await builder.getOne();
        if (!results)
            throw new common_1.HttpException('Not Found', common_1.HttpStatus.NOT_FOUND);
        await (await this.getQueryBuilder())
            .delete()
            .from(this.entity)
            .where('id = :id', { id })
            .execute();
        return results;
    }
    async prepareBuilder(query, queryBuilder = this.getQueryBuilder()) {
        const builder = await queryBuilder;
        const orderBy = await this.applyOrderBy(query, builder);
        const results = await this.includeContains(query, orderBy);
        return results;
    }
    async fetchByColumns(request, builder) {
        const { columns: columnNames } = request;
        console.log('columnNames', columnNames);
        if (!columnNames) {
            return builder;
        }
        console.log(columnNames);
        const columns = columnNames.split(',');
        columns.forEach((column) => {
            const columnArr = column.split(':');
            if (builder.getQuery().toString().includes(columnArr[0])) {
                builder.where(`entity.${columnArr[0]} = :${columnArr[0]}`, {
                    [columnArr[0]]: [columnArr[1]],
                });
            }
        });
        return builder;
    }
    includeContains(request, builder) {
        const { contain } = request;
        if (!contain) {
            return builder;
        }
        const contains = contain.split(',');
        contains.forEach((contain) => {
            if (builder.hasRelation(this.entity, contain)) {
                builder.leftJoinAndSelect(`entity.${contain}`, contain);
            }
        });
        return builder;
    }
    applyOrderBy(request, builder) {
        const { orderBy } = request;
        if (!orderBy) {
            return builder;
        }
        const sort = orderBy.split(',');
        sort.forEach((column) => {
            const sortArr = column.split(':');
            if (builder.getQuery().toString().includes(sortArr[0])) {
                builder.orderBy(`entity.${sortArr[0]}`, sortArr[1].toUpperCase());
            }
        });
        return builder;
    }
    async validateBody() {
        console.log('validate');
    }
    async getQueryBuilder() {
        return (0, typeorm_1.getConnection)()
            .getRepository(this.entity)
            .createQueryBuilder('entity');
    }
};
BaseService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [Object])
], BaseService);
exports.BaseService = BaseService;
//# sourceMappingURL=base.service.js.map