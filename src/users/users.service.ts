import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import {
  IPaginationOptions,
  paginate,
  Pagination,
} from 'nestjs-typeorm-paginate';
import { createQueryBuilder } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  async store(createUserDto: CreateUserDto) {
    try {
      const user = User.create(createUserDto);
      const createdUser = await User.save(user).catch((err) => {
        throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
      });
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
    const result = user.softRemove();
    console.log(result);
    return result;
  }
}
