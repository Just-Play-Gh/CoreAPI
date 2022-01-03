import { BaseEntity } from 'typeorm';
import { Model } from './model.entity';
export declare enum RankingType {
    popular = "true",
    nonPopular = "false"
}
export declare class VehicleMake extends BaseEntity {
    id: number;
    makeName: string;
    ranking: RankingType;
    models: Model[];
}
