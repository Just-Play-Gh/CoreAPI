import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  DefaultValuePipe,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { GroupsService } from './groups.service';
import { CreateGroupDto } from './dto/create-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';
import { GetGroupsDto } from './dto/get-group.dto';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { CurrentUser } from 'src/decorators/current-user.decorator';
import { AddDeviceToGroupDto } from './dto/add-device-to-group.dto';

@Controller('groups')
export class GroupsController {
  constructor(private readonly groupsService: GroupsService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() createGroupDto: CreateGroupDto, @CurrentUser() authuser) {
    return this.groupsService.create(createGroupDto, authuser);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page = 1,
    @Query('limit', new DefaultValuePipe(15), ParseIntPipe) limit = 15,
    @Query() getGroupsDto: GetGroupsDto,
  ) {
    delete getGroupsDto.page;
    delete getGroupsDto.limit;
    return this.groupsService.findAll({ page, limit }, getGroupsDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.groupsService.findOne(+id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateGroupDto: UpdateGroupDto) {
    return this.groupsService.update(+id, updateGroupDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.groupsService.remove(+id);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id')
  addDeviceToGroup(addDeviceToGroupDto: AddDeviceToGroupDto) {
    return this.groupsService.addDeviceToGroup(addDeviceToGroupDto);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id')
  removeDeviceFromGroup(removeDeviceFromGroupDto: AddDeviceToGroupDto) {
    return this.groupsService.removeDeviceFromGroup(removeDeviceFromGroupDto);
  }
}