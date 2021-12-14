import {
  Body,
  Controller,
  Delete,
  ExecutionContext,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { NestApplicationContext, Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { Customer } from 'src/customer/entities/customer.entity';
import { Permission } from 'src/decorators/permissions.decorator';
import { PermissionGuard } from 'src/guards/permission-guard';
import { PermissionGuardInterceptor } from 'src/interceptors/permission-guard.interceptor';
import { PermissionsType } from 'src/types';
import { createConnection, getConnection } from 'typeorm';

@Controller()
export class BaseController {
  private _dtos;
  private _permissions;
  constructor(protected readonly service) {}

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

  @Get()
  @UseGuards(AuthGuard('jwt'), PermissionGuard)
  async getAll(@Query() query) {
    return this.service.getAll(query);
  }

  @Get('/findByColumns')
  async getByColumns(@Query() query) {
    return this.service.getByColumns(query);
  }

  @Get(':id')
  async getOne(@Param() param, @Query() query) {
    return this.service.getOne(param, query);
  }

  @Post()
  async store(@Body() createData, @Query() query) {
    return this.service.store(createData, query, this.dtos?.store);
  }

  @Patch(':id')
  async update(@Body() createData, @Query() query, @Param() param) {
    return this.service.update(param, createData, query, this.dtos?.update);
  }

  @Delete(':id')
  async delete(@Param() param) {
    return this.service.delete(param);
  }
}
