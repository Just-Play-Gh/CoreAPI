import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import {
  IPaginationOptions,
  paginate,
  Pagination,
} from 'nestjs-typeorm-paginate';
import { createQueryBuilder } from 'typeorm';
import { AddDeviceToGroupDto } from './dto/add-device-to-group.dto';
import { CreateGroupDto } from './dto/create-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';
import { DeviceGroup } from './entities/device-groups.entity';
import { Device } from './entities/device.entity';
import { Group } from './entities/group.entity';

@Injectable()
export class GroupsService {
  async create(createGroupDto: CreateGroupDto, authuser) {
    try {
      const group = await Group.create(createGroupDto);
      group.creatorId = authuser.id;
      return await Group.save(group);
    } catch (error: any) {
      if (error.code === 'ER_DUP_ENTRY') {
        throw new HttpException(
          'Record already exists',
          HttpStatus.UNPROCESSABLE_ENTITY,
        );
      }
      throw error;
    }
  }

  async findAll(
    options: IPaginationOptions,
    filter = {},
  ): Promise<Pagination<Group>> {
    const groupRepository = createQueryBuilder(Group)
      .where(filter)
      .orderBy({ created: 'DESC' });
    const groups = await paginate<Group>(groupRepository, options);
    return groups;
  }

  async findOne(id: number) {
    const group = await Group.findOne({ id: id });
    if (!group)
      throw new HttpException('Group not found', HttpStatus.NOT_FOUND);
    return group;
  }

  async update(id: number, updateGroupDto: UpdateGroupDto) {
    const group = await Group.findOne(id);
    if (!group)
      throw new HttpException('Group not found', HttpStatus.NOT_FOUND);
    group.name = updateGroupDto.name;
    group.description = updateGroupDto.description;
    return await group.save();
  }

  async remove(id: number) {
    const group = await Group.findOne(id);
    if (!group)
      throw new HttpException('Group not found', HttpStatus.NOT_FOUND);
    const result = await group.softRemove();
    console.log(result);
    return result;
  }

  async addDeviceToGroup(addDeviceToGroupDto: AddDeviceToGroupDto) {
    const group = await Group.findOne(addDeviceToGroupDto.groupId);
    if (!group)
      throw new HttpException('Group not found', HttpStatus.NOT_FOUND);

    const device = await Device.findOne(addDeviceToGroupDto.deviceId);
    if (!device)
      throw new HttpException('Device not found', HttpStatus.NOT_FOUND);

    try {
      await DeviceGroup.create(addDeviceToGroupDto);
      return { group, device };
    } catch (error: any) {
      if (error.code === 'ER_DUP_ENTRY') {
        throw new HttpException(
          'Record already exists',
          HttpStatus.UNPROCESSABLE_ENTITY,
        );
      }
    }
  }
}
