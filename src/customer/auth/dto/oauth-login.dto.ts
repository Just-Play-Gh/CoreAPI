import { IsNotEmpty } from 'class-validator';

export class OAuthLoginDto {
  @IsNotEmpty({ message: 'Please enter your email' })
  email: string;

  @IsNotEmpty({ message: 'Please enter your provider ID' })
  providerId: string;

  @IsNotEmpty({ message: 'Please enter a provider' })
  provider: string;
}
