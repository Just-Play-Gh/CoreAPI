import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '../user/entities/user.entity';
import { UserService } from '../user/user.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}
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

  async login(loginData: LoginDto): Promise<User> {
    try {
      const user = await this.validateUser(loginData);
      const payload = {
        userId: user.id,
      };
      user['access_token'] = this.jwtService.sign(payload);
      return user;
    } catch (error) {
      console.log(error);
    }
  }

  async validateUser(loginDto: LoginDto): Promise<User> {
    const { phoneNumber, password } = loginDto;

    const user = await this.userService.getUser({ phoneNumber });
    if (!(await user?.validatePassword(password))) {
      throw new UnauthorizedException();
    }

    return user;
  }
}
