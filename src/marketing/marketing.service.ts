import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import {
  IPaginationOptions,
  paginate,
  Pagination,
} from 'nestjs-typeorm-paginate';
import { AWSS3Service } from 'src/resources/aws-s3-service';
import { User } from 'src/users/entities/user.entity';
import { createQueryBuilder } from 'typeorm';
import { CreateMarketingCampaignDto } from './dto/create-marketing-campaign.dto';
import { UpdateMarketingCampaignDto } from './dto/update-marketing-campaign.dto';
import { MarketingCampaign } from './entities/marketing.entity';

@Injectable()
export class MarketingService {
  async findAll(
    options: IPaginationOptions,
    filter = {},
  ): Promise<Pagination<MarketingCampaign>> {
    const deviceRepository = createQueryBuilder(MarketingCampaign)
      .where(filter)
      .orderBy({ created: 'DESC' });

    const marketingCampaigns = await paginate<MarketingCampaign>(
      deviceRepository,
      options,
    );

    return marketingCampaigns;
  }
  async create(
    file: Express.Multer.File,
    createMarketingCampaignDto: CreateMarketingCampaignDto,
    user: User,
    file,
  ) {
    try {
      const imageUrl = await new AWSS3Service().uploadFile(file);
      const campaign = await MarketingCampaign.create(
        createMarketingCampaignDto,
      );
      campaign.createdBy = user.id;
      campaign.imageUrl = imageUrl;
      return await MarketingCampaign.save(campaign);
    } catch (error: any) {
      if (error.code === 'ER_DUP_ENTRY') {
        throw new HttpException(
          'Record already exists',
          HttpStatus.UNPROCESSABLE_ENTITY,
        );
      }
      throw error;
    }
  }

  async findOne(id: string) {
    const campaign = await MarketingCampaign.findOne({ id: id });
    if (!campaign)
      throw new HttpException(
        'Marketing Campaign not found',
        HttpStatus.NOT_FOUND,
      );
    return campaign;
  }

  async update(
    file: Express.Multer.File,
    id: string,
    updateMarketingCampaignDto: UpdateMarketingCampaignDto,
    file,
  ) {
    const campaign = await MarketingCampaign.findOne(id);
    if (!campaign)
      throw new HttpException(
        'Marketing Campaign not found',
        HttpStatus.NOT_FOUND,
      );
    if (updateMarketingCampaignDto.image) {
      const imageUrl = await new AWSS3Service().uploadFile(file);
      campaign.imageUrl = imageUrl;
    }
    campaign.description = updateMarketingCampaignDto.description;
    campaign.name = updateMarketingCampaignDto.name;

    campaign.expiryDate = updateMarketingCampaignDto.expiryDate;
    campaign.scheduleDate = updateMarketingCampaignDto.scheduleDate;
    campaign.status = updateMarketingCampaignDto.status;
    await MarketingCampaign.save(campaign);
    console.log(campaign, updateMarketingCampaignDto);
    return campaign;
  }

  async remove(id: string) {
    const campaign = await MarketingCampaign.findOne(id);
    if (!campaign)
      throw new HttpException('Campaign not found', HttpStatus.NOT_FOUND);
    const result = await campaign.softRemove();
    console.log(result);
    return result;
  }
}
