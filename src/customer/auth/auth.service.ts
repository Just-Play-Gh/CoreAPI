import { ConflictException, Injectable } from '@nestjs/common';
import { User } from '../user/entities/user.entity';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  async register(registerData: RegisterDto): Promise<User> {
    const user = User.create();
    for (const key in registerData) {
      user[key] = registerData[key];
    }
    user.status = true;
    const userExists = await User.findOne({
      phoneNumber: user.phoneNumber,
    });
    if (userExists) {
      throw new ConflictException('User already exists');
    }
    await User.save(user);
    return user;
  }
}
