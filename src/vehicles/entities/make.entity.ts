import { Entity, Column, BaseEntity, PrimaryColumn, OneToMany } from 'typeorm';
import { Model } from './model.entity';

export enum RankingType {
  popular = 'true',
  nonPopular = 'false',
}

@Entity({ name: 'vehicle_makes', schema: 'public' })
export class VehicleMake extends BaseEntity {
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

  @OneToMany(() => Model, (model) => model.make) // specify inverse side as a second parameter
  models: Model[];
}
