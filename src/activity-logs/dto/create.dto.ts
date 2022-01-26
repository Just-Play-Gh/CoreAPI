import { IsNotEmpty } from 'class-validator';

export class CreateActivityDto {
  @IsNotEmpty({ message: 'Log name is required' })
  logName: string;

  @IsNotEmpty({ message: 'New password is required' })
  newPassword: string;

  @IsNotEmpty({ message: 'New password confirmation is required' })
  newPasswordConfirmation: string;
}
