import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { lastValueFrom, map } from 'rxjs';
import { BaseService } from 'src/resources/base.service';
import { getConnection, Like } from 'typeorm';
import { SearchDto } from './dto/search.dto';
import { VehicleMake, RankingType } from './entities/make.entity';
import { Model } from './entities/model.entity';

@Injectable()
export class VehicleService extends BaseService {
  constructor(private readonly httpService: HttpService) {
    super(VehicleMake);
  }

  async getAllMake(): Promise<VehicleMake[]> {
    return await VehicleMake.find({ ranking: RankingType.popular });
  }

  async searchMake(searchDto: SearchDto): Promise<VehicleMake[]> {
    const { searchKey } = searchDto;
    console.log(searchKey, !searchKey || searchKey === '');
    console.log(await this.getAllMake());
    return !searchKey || searchKey === ''
      ? await this.getAllMake()
      : await VehicleMake.find({
          relations: ['models'],
          where: { makeName: Like(`%${searchKey}%`) },
        });
    // return await VehicleMake.getRepository()
    // .createQueryBuilder()
    // .where('makeName like :name', { name: `%${searchKey}%` })
    // .leftJoinAndSelect(`entity.models`, 'models')
    // .getMany();
  }

  async insertModel() {
    const makes = await VehicleMake.find();
    for (const element of makes) {
      try {
        this.sleep(200);
        const url = `${process.env.VEHICLE_SERVICE_API_URL}/vehicles/GetModelsForMakeId/${element.id}?format=json`;
        const response = await lastValueFrom(
          this.httpService.get(url).pipe(map((res) => res.data)),
        );
        if (response.Count > 0) {
          const insertValue = response.Results.map((item) => {
            return {
              id: item.Model_ID,
              modelName: item.Model_Name,
              makeId: item.Make_ID,
            };
          });

          await getConnection()
            .createQueryBuilder()
            .insert()
            .into(Model)
            .values(insertValue)
            .orIgnore(true)
            .execute();
        }
      } catch (error) {
        console.log(error);
      }
    }
    return 'success';
  }

  sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
