import { BaseEntity } from 'typeorm';
export declare enum RankingType {
    popular = "true",
    nonPopular = "false"
}
export declare class AllMakes extends BaseEntity {
    id: number;
    makeName: string;
    ranking: RankingType;
}
