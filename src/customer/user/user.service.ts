import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ChangePasswordDto } from './dto/change-password.dto';
import { GetUserDto } from './dto/get-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
  async getUser(getUserDto: GetUserDto): Promise<User> {
    const { phoneNumber } = getUserDto;
    return User.findOne({ phoneNumber });
  }

  async updateUserByPhoneNumber(updateUserDto: UpdateUserDto): Promise<User> {
    const { phoneNumber } = updateUserDto;
    const user = await User.findOne({ phoneNumber });
    delete updateUserDto.phoneNumber;
    for (const key in updateUserDto) {
      user[key] = updateUserDto[key];
    }
    await User.save(user);
    return user;
  }

  constructor(private readonly userService: UserService) {}
  async changePassword(
    changePasswordDto: ChangePasswordDto,
    user: User,
  ): Promise<{ message: string }> {
    const { currentPassword, newPassword, newPasswordConfirmation } =
      changePasswordDto;
    try {
      if (newPassword !== newPasswordConfirmation)
        throw new HttpException(
          'Passwords do not match',
          HttpStatus.BAD_REQUEST,
        );
      const user = await this.userService.getUser({ phoneNumber });
      if (!user) throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
      await this.userService.updateUserByPhoneNumber({ phoneNumber, password });
      return { message: 'Verification successful' };
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}
