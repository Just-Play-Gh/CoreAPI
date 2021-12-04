import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Driver } from '../entities/driver.entity';
import { CreateAuthDto } from './dto/create-auth.dto';
import { LoginDto } from './dto/login.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';

@Injectable()
export class AuthService {
  constructor(private driverService: Driverser) {}

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
    const { phoneNumber, password, country } = loginDto;
    const customer = await this.customerService.getCustomerByPhoneNumber({
      phoneNumber,
      country,
    });
    if (!(await customer?.validatePassword(password))) {
      throw new UnauthorizedException();
    }
    return customer;
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

  create(createAuthDto: CreateAuthDto) {
    return 'This action adds a new auth';
  }

  findAll() {
    return `This action returns all auth`;
  }

  findOne(id: number) {
    return `This action returns a #${id} auth`;
  }

  update(id: number, updateAuthDto: UpdateAuthDto) {
    return `This action updates a #${id} auth`;
  }

  remove(id: number) {
    return `This action removes a #${id} auth`;
  }
}
