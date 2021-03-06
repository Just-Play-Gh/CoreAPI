import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Logger,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CurrentUser } from 'src/decorators/current-user.decorator';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { validateDto } from 'src/helpers/validator';
import { PermissionGuard } from '../guards/permission-guard';

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
  @UseGuards(JwtAuthGuard, PermissionGuard)
  async getAll(@Query() query) {
    Logger.log('request...', query);
    return this.service.getAll(query);
  }

  @UseGuards(JwtAuthGuard, PermissionGuard)
  @Get('/findByColumns')
  async getByColumns(@Query() query) {
    Logger.log('request...', query);
    return this.service.getByColumns(query);
  }

  @UseGuards(JwtAuthGuard, PermissionGuard)
  @Get('/search')
  async search(@Query() query) {
    return this.service.search(query);
  }

  @UseGuards(JwtAuthGuard, PermissionGuard)
  @Get(':id')
  async getOne(@Param() param, @Query() query) {
    Logger.log('request...', { ...query, ...param });
    return this.service.getOne(param, query);
  }

  @UseGuards(JwtAuthGuard, PermissionGuard)
  @Post()
  async store(@Body() body, @CurrentUser() user) {
    if (this.dtos?.store) {
      const DtoClass = this.dtos?.store;
      const validDto = await validateDto(new DtoClass(), body);
      if (Object.keys(validDto).length > 0)
        throw new HttpException(validDto, HttpStatus.BAD_REQUEST);
    }
    return this.service.store(body, user);
  }

  @UseGuards(JwtAuthGuard, PermissionGuard)
  @Patch(':id')
  async update(
    @Body() body,
    @Query() query,
    @Param() param,
    @CurrentUser() user,
  ) {
    Logger.log('request...', { ...query, ...param, ...body });
    if (this.dtos?.update) {
      const DtoClass = this.dtos?.update;
      const validDto = await validateDto(new DtoClass(), body);
      if (Object.keys(validDto).length > 0)
        throw new HttpException(validDto, HttpStatus.BAD_REQUEST);
    }
    return this.service.update(param, body, user);
  }

  @UseGuards(JwtAuthGuard, PermissionGuard)
  @Delete(':id')
  async delete(@Param() param, @CurrentUser() user) {
    return this.service.delete(param, user);
  }
}
