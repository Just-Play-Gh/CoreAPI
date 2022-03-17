import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import {
  IPaginationOptions,
  paginate,
  Pagination,
} from 'nestjs-typeorm-paginate';
import { createQueryBuilder } from 'typeorm';
import { AddDeviceToGroupDto } from './dto/add-device-to-group.dto';
import { CreateGroupDto } from './dto/create-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';
import { Device } from './entities/device.entity';
import { Group } from './entities/group.entity';

@Injectable()
export class GroupsService {
  async create(createGroupDto: CreateGroupDto, authuser) {
    try {
      const group = await Group.create(createGroupDto);
      group.customerId = authuser.id;
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

  async getGroupDevices(
    options: IPaginationOptions,
    groupId,
    filter = {},
  ): Promise<any> {
    const groups = await Group.findOne(
      { id: groupId },
      { relations: ['devices'] },
    );
    return groups.devices;
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

  async syncDevices(groupId, syncDevices: AddDeviceToGroupDto) {
    const group = await Group.findOne(groupId);
    if (!group)
      throw new HttpException('Group not found', HttpStatus.NOT_FOUND);
    try {
      group.devices = syncDevices.devices;
      return Group.save(group);
    } catch (error: any) {
      Logger.log('An error occured while syncing devices to group ', {
        syncDevices,
      });
      throw error;
    }
  }
  async removeDeviceFromGroup(
    groupId,
    removeDeviceFromGroup: AddDeviceToGroupDto,
  ) {
    Logger.log('Removing Device from group', { removeDeviceFromGroup });
    const group = await Group.findOne({
      where: { id: groupId },
      relations: ['devices'],
    });
    if (!group)
      throw new HttpException('Group not found', HttpStatus.NOT_FOUND);
    try {
      group.devices = await group.devices.filter((device) => {
        return removeDeviceFromGroup.devices.includes(device.id);
      });
      Logger.log('Device removed successfully', { removeDeviceFromGroup });
      return Group.save(group);
    } catch (error: any) {
      Logger.log('An error occured when removing device', {
        removeDeviceFromGroup,
        error,
      });
      throw error;
    }
  }
}
