import { Body, Controller, Patch, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { ChangePasswordDto } from './dto/change-password.dto';
import { User } from './entities/user.entity';
import { CurrentUser } from './user.decorator';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(JwtAuthGuard)
  @Patch('/change-password')
  async changePassword(
    @Body() changePassword: ChangePasswordDto,
    @CurrentUser() user: User,
  ): Promise<{ message: string }> {
    return this.userService.changePassword(changePassword, user);
  }
}
