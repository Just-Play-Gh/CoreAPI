import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { Customer } from 'src/customer/entities/customer.entity';
import { createConnection, getConnection } from 'typeorm';

@Controller()
export class BaseController {
  private _dtos;
  constructor(protected readonly service) {}

  set dtos(dtos) {
    this._dtos = dtos;
  }

  get dtos() {
    return this._dtos;
  }

  @Get()
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
