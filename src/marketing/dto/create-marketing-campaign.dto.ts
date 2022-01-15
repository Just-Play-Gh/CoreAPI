import { IsNotEmpty, IsOptional } from 'class-validator';
export class CreateMarketingCampaignDto {
  @IsNotEmpty({ message: 'The campaign name is required' })
  name: string;

  @IsOptional()
  description: string;

  @IsOptional()
  url: string;

  @IsOptional()
  scheduleDate: Date;

  @IsOptional()
  expiryDate: Date;
}
