import { Entity, Column, BaseEntity, PrimaryColumn, ManyToOne } from 'typeorm';
import { VehicleMake } from './make.entity';

@Entity({ name: 'vehicle_models', schema: 'public' })
export class Model extends BaseEntity {
  @PrimaryColumn()
  id: number;

  @Column()
  modelName: string;

  @Column()
  makeId: number;

  @ManyToOne(() => VehicleMake, (make) => make.id)
  make: VehicleMake;
}
