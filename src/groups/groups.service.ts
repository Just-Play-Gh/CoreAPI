import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import {
  IPaginationOptions,
  paginate,
  Pagination,
} from 'nestjs-typeorm-paginate';
import { createQueryBuilder } from 'typeorm';
import { CreateGroupDto } from './dto/create-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';
import { Group } from './entities/group.entity';

@Injectable()
export class GroupsService {
  async create(createGroupDto: CreateGroupDto) {
    try {
      const group = await Group.create(createGroupDto);
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

  update(id: number, updateGroupDto: UpdateGroupDto) {
    return `This action updates a #${id} group`;
  }

  async remove(id: number) {
    const group = await Group.findOne(id);
    if (!group)
      throw new HttpException('Group not found', HttpStatus.NOT_FOUND);
    const result = await group.softRemove();
    console.log(result);
    return result;
  }
}
