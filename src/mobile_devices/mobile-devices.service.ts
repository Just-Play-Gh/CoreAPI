import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateMobileDeviceDto } from './dto/create.dto';
import { UpdateMobileDeviceDto } from './dto/update.dto';
import { MobileDevice } from './entities/mobile-device.entity';

@Injectable()
export class MobileDeviceService {
  async store(
    createMobileDeviceDto: CreateMobileDeviceDto,
  ): Promise<MobileDevice> {
    console.log(createMobileDeviceDto);
    try {
      const device = await MobileDevice.findOne({
        where: {
          push_notification_token:
            createMobileDeviceDto.push_notification_token,
          user_type: createMobileDeviceDto.user_type,
        },
      });
      if (!device) {
        const mobileDevice = await MobileDevice.create(createMobileDeviceDto);
        return await MobileDevice.save(mobileDevice);
      }
      return device;
    } catch (error) {
      console.log(error);
      throw new HttpException(
        'Could not add device details',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async update(
    id: string,
    updateMobileDeviceDto: UpdateMobileDeviceDto,
  ): Promise<MobileDevice> {
    console.log(id);
    try {
      const device = await MobileDevice.findOne(id);
      console.log(device);
      if (!device) {
        throw new HttpException('Device not found', HttpStatus.NOT_FOUND);
      }
      device.user_id = updateMobileDeviceDto.user_id;
      return device.save();
    } catch (error) {
      throw error;
    }
  }
}
