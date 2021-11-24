import { Controller, Post } from '@nestjs/common';
import { User } from '../user/entities/user.entity';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Post('/register')
  async register(registerDto: RegisterDto): Promise<User> {
    return this.authService.register(registerDto);
  }
}
