import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import {
  IPaginationOptions,
  paginate,
  Pagination,
} from 'nestjs-typeorm-paginate';
import { createQueryBuilder, Like } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AssignRoleDto } from './dto/assign-role-user.dto';
import { User } from './entities/user.entity';
import { Role } from 'src/role/entity/role.entity';

@Injectable()
export class UsersService {
  async store(createUserDto: CreateUserDto) {
    try {
      if (createUserDto.roleId) {
        const role = await Role.findOne(createUserDto.roleId);
        if (!role) {
          console.log('role not found');
          throw new HttpException('Role Not Found', HttpStatus.NOT_FOUND);
        }
      }
      const user = await User.create(createUserDto);
      const createdUser = await User.save(user);
      return createdUser;
    } catch (error) {
      console.log('An error occured', error);
      throw new HttpException('Sorry an error occured', HttpStatus.BAD_REQUEST);
    }
  }

  async paginate(
    options: IPaginationOptions,
    searchParams = {},
  ): Promise<Pagination<User>> {
    let userRepository;
    if (searchParams) {
      userRepository = createQueryBuilder(User)
        .where(searchParams)
        .withDeleted();
    } else {
      userRepository = createQueryBuilder(User).withDeleted();
    }
    const users = await paginate<User>(userRepository, options);
    if (!users['items'])
      throw new HttpException('No users were found', HttpStatus.NOT_FOUND);
    return users;
  }

  async findOne(id: number) {
    const user = await User.findOne({ id: id });
    if (!user) throw new HttpException('User Not Found', HttpStatus.NOT_FOUND);
    return user;
  }

  async findByEmail(email: string): Promise<User> {
    const user = await User.findOne({ email });
    if (!user) throw new HttpException('User Not Found', HttpStatus.NOT_FOUND);
    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const user = await User.findOne(id);
    if (!user) throw new HttpException('User Not Found', HttpStatus.NOT_FOUND);
    const { firstName, lastName } = updateUserDto;
    user.firstName = firstName;
    user.lastName = lastName;
    return await user.save();
  }

  async remove(id: number) {
    const user = await User.findOne(id);
    if (!user) throw new HttpException('User Not Found', HttpStatus.NOT_FOUND);
    const result = await user.softRemove();
    console.log(result);
    return result;
  }

  async search(param) {
    try {
      Logger.log('searching user...', param);
      const customer = await User.find({
        where: [
          { email: Like(`%${param.searchKey}%`) },
          { phoneNumber: Like(`%${param.searchKey}%`) },
        ],
      });
      return customer;
    } catch (error) {
      Logger.log('error searching for user', error);
      throw error;
    }
  }

  async assignRoleToUser(assignRoleDto: AssignRoleDto) {
    try {
      const { userId, role } = assignRoleDto;
      const user = await User.findOne(+userId);
      if (!user)
        throw new HttpException('User Not Found', HttpStatus.NOT_FOUND);
      user.role = role;
      return await user.save();
    } catch (error) {
      Logger.log('error assigning role to user', error);
      throw error;
    }
  }
}
