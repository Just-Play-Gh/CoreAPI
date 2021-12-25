import { Entity, Column, BaseEntity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'vehicle_models', schema: 'public' })
export class VehicleModels extends BaseEntity {
  @PrimaryColumn()
  id: number;

  @Column()
  modelName: string;

  @Column()
  makeId: number;
}
