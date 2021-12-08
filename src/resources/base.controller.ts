import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { Customer } from 'src/customer/entities/customer.entity';
import { createConnection, getConnection } from 'typeorm';

@Controller()
export class BaseController {
  public _dtos;
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
  async store(@Body() createData) {
    return this.service.store(createData);
  }
}
