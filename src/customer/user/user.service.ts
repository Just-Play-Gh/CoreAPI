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

  async changePassword(
    changePasswordDto: ChangePasswordDto,
    userPayload: User,
  ): Promise<{ message: string }> {
    const { currentPassword, newPassword, newPasswordConfirmation } =
      changePasswordDto;
    const { id } = userPayload;
    try {
      const user: User = await User.findOne({ id });
      if (!user || !user.validatePassword(currentPassword))
        throw new HttpException('Invalid Password', HttpStatus.BAD_REQUEST);
      if (newPassword !== newPasswordConfirmation)
        throw new HttpException(
          'Passwords do not match',
          HttpStatus.BAD_REQUEST,
        );
      user.password = newPassword;
      await User.save(user);
      return { message: 'Password changed successful' };
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}
