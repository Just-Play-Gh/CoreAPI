import { IsIn, IsOptional } from 'class-validator';
import { MarketingStatus } from '../entities/marketing.entity';
export class GetMarketingCampaignDto {
  @IsOptional()
  limit: number;

  @IsOptional()
  page: number;

  @IsIn([
    MarketingStatus.Active,
    MarketingStatus.Inactive,
    MarketingStatus.Expired,
  ])
  @IsOptional()
  status: string;
}
