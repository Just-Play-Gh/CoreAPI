import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { lastValueFrom, map } from 'rxjs';
import { getConnection } from 'typeorm';
import { SearchDto } from './dto/search.dto';
import { AllMakes, RankingType } from './entities/make.entity';
import { VehicleModels } from './entities/vehicleModels.entity';

@Injectable()
export class DeviceService {
  constructor(private readonly httpService: HttpService) {}
  async getAllMake(): Promise<AllMakes[]> {
    return await AllMakes.find({ ranking: RankingType.popular });
  }

  async searchMake(searchDto: SearchDto): Promise<AllMakes[]> {
    const searchKey = { searchDto };
    return await AllMakes.getRepository()
      .createQueryBuilder()
      .where('makeName like :name', { name: `%${searchKey}%` })
      .getMany();
  }

  async insertModel() {
    const makes = await AllMakes.find();
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
            .into(VehicleModels)
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
