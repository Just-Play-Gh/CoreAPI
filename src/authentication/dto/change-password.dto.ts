import { IsNotEmpty, IsOptional, MinLength } from 'class-validator';
import { Match } from 'src/helpers/password.decorator';

export class ChangePasswordDto {
  @IsNotEmpty({ message: 'Current password is required' })
  currentPassword: string;

  @IsNotEmpty({ message: 'Password is required' })
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  newPassword: string;

  @IsNotEmpty({ message: 'Password confirmation is required' })
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  @Match('newPassword', { message: 'Passwords do not match' })
  newPasswordConfirmation: string;

  @IsOptional()
  firstTimer: boolean;

  @IsNotEmpty({ message: 'User type required' })
  userType: string;
}
