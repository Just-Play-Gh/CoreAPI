import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { DriverService } from '../driver.service';
import { Driver } from '../entities/driver.entity';
import { CreateAuthDto } from './dto/create-auth.dto';
import { LoginDto } from './dto/login.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private driverService: DriverService,
    private readonly jwtService: JwtService,
  ) {}

  async login(loginData: LoginDto): Promise<Driver> {
    try {
      const user = await this.validateUser(loginData);
      return this.generateToken(user);
    } catch (error) {
      console.log(error);
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    }
  }

  async validateUser(loginDto: LoginDto): Promise<Driver> {
    const { phoneNumber, password } = loginDto;
    console.log({ phoneNumber, password });
    const driver = await this.driverService.getDriverByPhoneNumber({
      phoneNumber,
      country: 'GH',
    });
    if (!(await driver?.validatePassword(password))) {
      throw new UnauthorizedException();
    }
    return driver;
  }

  generateToken(user: Driver) {
    const payload = {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      phoneNumber: user.phoneNumber,
    };
    user['access_token'] = this.jwtService.sign(payload);
    return user;
  }
}
