import { IsIn, IsNotEmpty, IsOptional } from 'class-validator';
import { MarketingStatus } from '../entities/marketing.entity';
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

  @IsIn([
    MarketingStatus.Active,
    MarketingStatus.Inactive,
    MarketingStatus.Expired,
  ])
  @IsOptional()
  status: MarketingStatus;

  @IsOptional()
  createdBy: number;
}
