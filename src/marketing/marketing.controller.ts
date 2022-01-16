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
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { MarketingService } from './marketing.service';
import { CreateMarketingCampaignDto } from './dto/create-marketing-campaign.dto';
import { UpdateMarketingCampaignDto } from './dto/update-marketing-campaign.dto';
import { GetMarketingCampaignDto } from './dto/get-marketing-campaign.dto';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('marketing/campaign')
export class MarketingController {
  constructor(private readonly marketingService: MarketingService) {}

  @Post()
  @UseInterceptors(FileInterceptor('image'))
  create(
    @UploadedFile() file: Express.Multer.File,
    @Body() createMarketingDto: CreateMarketingCampaignDto,
  ) {
    return this.marketingService.create(file, createMarketingDto);
  }

  @Get()
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
  findOne(@Param('id') id: string) {
    return this.marketingService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateMarketingDto: UpdateMarketingCampaignDto,
  ) {
    return this.marketingService.update(id, updateMarketingDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.marketingService.remove(id);
  }
}
