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
  async create(createUserDto: CreateUserDto) {
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
    let productRepository;
    if (searchParams) {
      productRepository = createQueryBuilder(User)
        .where(searchParams)
        .withDeleted();
    } else {
      productRepository = createQueryBuilder(User).withDeleted();
    }
    const products = await paginate<User>(productRepository, options);
    if (!products['items'])
      throw new HttpException('No products were found', HttpStatus.NOT_FOUND);
    return products;
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
