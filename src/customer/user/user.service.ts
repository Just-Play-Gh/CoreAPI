import { Injectable } from '@nestjs/common';
import { GetUserDto } from './dto/get-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
  async getUser(getUserDto: GetUserDto): Promise<User> {
    const { phoneNumber } = getUserDto;
    return User.findOne({ phoneNumber });
  }
}
