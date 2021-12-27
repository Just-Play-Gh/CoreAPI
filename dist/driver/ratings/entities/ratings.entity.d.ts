import { Driver } from '../../../driver/entities/driver.entity';
import { BaseEntity } from 'typeorm';
export declare class DriverRatings extends BaseEntity {
    id: number;
    driver: Driver;
    star: number;
    created: Date;
}
