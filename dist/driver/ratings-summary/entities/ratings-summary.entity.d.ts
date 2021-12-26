import { Driver } from '../../../driver/entities/driver.entity';
import { BaseEntity } from 'typeorm';
export declare class DriverRatingsSummary extends BaseEntity {
    id: number;
    driver: Driver;
    totalStars: number;
    totalCount: number;
    date: Date;
}
