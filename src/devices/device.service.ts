import { Injectable } from '@nestjs/common';
//import { BaseService } from 'src/resources/base.service';
import { AllMakes } from './entities/make.entity';

@Injectable()
export class DeviceService {
  async getAllMake(): Promise<AllMakes[]> {
    return await AllMakes.find();
  }

  //   async getModels() {}
}
