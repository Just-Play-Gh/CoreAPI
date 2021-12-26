"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const nestjs_typeorm_paginate_1 = require("nestjs-typeorm-paginate");
const typeorm_1 = require("typeorm");
const user_entity_1 = require("./entities/user.entity");
let UsersService = class UsersService {
    async create(createUserDto) {
        try {
            const user = user_entity_1.User.create(createUserDto);
            user.password = await user.generatePassword(8);
            const createdUser = await user_entity_1.User.save(user).catch((err) => {
                throw new common_1.HttpException(err.message, common_1.HttpStatus.BAD_REQUEST);
            });
            return createdUser;
        }
        catch (error) {
            console.log('An error occured', error);
            throw new common_1.HttpException('Sorry an error occured', common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async paginate(options, searchParams = {}) {
        let productRepository;
        if (searchParams) {
            productRepository = (0, typeorm_1.createQueryBuilder)(user_entity_1.User)
                .where(searchParams)
                .withDeleted();
        }
        else {
            productRepository = (0, typeorm_1.createQueryBuilder)(user_entity_1.User).withDeleted();
        }
        const products = await (0, nestjs_typeorm_paginate_1.paginate)(productRepository, options);
        if (!products['items'])
            throw new common_1.HttpException('No products were found', common_1.HttpStatus.NOT_FOUND);
        return products;
    }
    async findOne(id) {
        const user = await user_entity_1.User.findOne({ id: id });
        if (!user)
            throw new common_1.HttpException('User Not Found', common_1.HttpStatus.NOT_FOUND);
        return user;
    }
    async findByEmail(email) {
        const user = await user_entity_1.User.findOne({ email });
        if (!user)
            throw new common_1.HttpException('User Not Found', common_1.HttpStatus.NOT_FOUND);
        return user;
    }
    async update(id, updateUserDto) {
        const user = await user_entity_1.User.findOne(id);
        if (!user)
            throw new common_1.HttpException('User Not Found', common_1.HttpStatus.NOT_FOUND);
        const { firstName, lastName } = updateUserDto;
        user.firstName = firstName;
        user.lastName = lastName;
        return await user.save();
    }
    async remove(id) {
        const user = await user_entity_1.User.findOne(id);
        if (!user)
            throw new common_1.HttpException('User Not Found', common_1.HttpStatus.NOT_FOUND);
        const result = user.softRemove();
        console.log(result);
        return result;
    }
};
UsersService = __decorate([
    (0, common_1.Injectable)()
], UsersService);
exports.UsersService = UsersService;
//# sourceMappingURL=users.service.js.map