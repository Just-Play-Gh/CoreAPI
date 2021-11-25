import { IsNotEmpty } from 'class-validator';

export class ChangePasswordDto {
  @IsNotEmpty({ message: 'Current password is required' })
  currentPassword: string;

  @IsNotEmpty({ message: 'New password is required' })
  newPassword: string;

  @IsNotEmpty({ message: 'New password confirmation is required' })
  newPasswordConfirmation: string;
}
