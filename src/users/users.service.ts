import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  async create(createUserDto: CreateUserDto) {
    try {
      const user = User.create(createUserDto);
      user.password = await user.generatePassword(8);
      const createdUser = User.save(user).catch((err) => {
        throw new HttpException(
          {
            message: err.message,
            satusCode: err.HttpStatus,
          },
          HttpStatus.BAD_REQUEST,
        );
      });
      return createdUser;
    } catch (error) {
      console.log('An error occured', error);
      throw new HttpException('Sorry an error occured', HttpStatus.BAD_REQUEST);
    }
  }

  findAll() {
    return User.find();
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
