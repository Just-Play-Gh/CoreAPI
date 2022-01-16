import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  DefaultValuePipe,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { MarketingService } from './marketing.service';
import { CreateMarketingCampaignDto } from './dto/create-marketing-campaign.dto';
import { UpdateMarketingCampaignDto } from './dto/update-marketing-campaign.dto';
import { GetMarketingCampaignDto } from './dto/get-marketing-campaign.dto';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { CurrentUser } from 'src/decorators/current-user.decorator';

@Controller('marketing/campaign')
export class MarketingController {
  constructor(private readonly marketingService: MarketingService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  create(
    @CurrentUser() authuser,
    @Body() createMarketingDto: CreateMarketingCampaignDto,
  ) {
    return this.marketingService.create(createMarketingDto, authuser);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async getMarketingCampaigns(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page = 1,
    @Query('limit', new DefaultValuePipe(15), ParseIntPipe) limit = 15,
    @Query() getMarketingCampaignDto: GetMarketingCampaignDto,
  ) {
    delete getMarketingCampaignDto.page;
    delete getMarketingCampaignDto.limit;
    return this.marketingService.findAll({ page, limit });
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  findOne(@Param('id') id: string) {
    return this.marketingService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  update(
    @Param('id') id: string,
    @Body() updateMarketingDto: UpdateMarketingCampaignDto,
  ) {
    return this.marketingService.update(id, updateMarketingDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(@Param('id') id: string) {
    return this.marketingService.remove(id);
  }
}
