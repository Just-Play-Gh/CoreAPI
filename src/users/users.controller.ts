import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
  DefaultValuePipe,
  ParseIntPipe,
  SetMetadata,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { SearchUserDto } from './dto/search-user.dto';
import { PermissionGuard } from 'src/guards/permission-guard';
import { Like } from 'typeorm';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @SetMetadata('permissions', ['user:read'])
  async create(@Body() createUserDto: CreateUserDto) {
    return await this.usersService.store(createUserDto);
  }

  @UseGuards(JwtAuthGuard, PermissionGuard)
  @Get()
  @SetMetadata('permissions', ['user:read'])
  findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page = 1,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit = 10,
    @Query() getUsers: SearchUserDto,
  ) {
    delete getUsers.page;
    delete getUsers.limit;
    let searchParams = [];

    if (getUsers.searchValue) {
      searchParams = [
        {
          email: Like('%' + getUsers.searchValue + '%'),
        },
        {
          phoneNumber: Like('%' + getUsers.searchValue + '%'),
        },
        {
          firstName: Like('%' + getUsers.searchValue + '%'),
        },
        {
          lastName: Like('%' + getUsers.searchValue + '%'),
        },
      ];
    }
    return this.usersService.paginate({ page, limit }, searchParams);
  }

  @Get(':id')
  @SetMetadata('permissions', ['user:read'])
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(+id);
  }

  @Patch(':id')
  @SetMetadata('permissions', ['user:update'])
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto);
  }

  @Delete(':id')
  @SetMetadata('permissions', ['user:delete'])
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
  @Get('/search')
  @SetMetadata('permissions', ['user:read'])
  async searchCustomer(@Query() params) {
    return await this.usersService.search(params);
  }
}
