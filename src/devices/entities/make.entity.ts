import { Entity, Column, BaseEntity, PrimaryColumn } from 'typeorm';

export enum RankingType {
  popular = 'true',
  nonPopular = 'false',
}

@Entity({ name: 'all_makes', schema: 'public' })
export class AllMakes extends BaseEntity {
  @PrimaryColumn()
  id: number;

  @Column()
  makeName: string;

  @Column({
    type: 'enum',
    enum: RankingType,
    default: RankingType.nonPopular,
  })
  ranking: RankingType;
}
