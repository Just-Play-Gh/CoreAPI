import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  BaseEntity,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

enum TruckStatus {
  Active = 'active',
  Inactive = 'inactive',
}
@Entity({ name: 'products', schema: 'public' })
export class Truck extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 60, unique: true })
  name: string;

  @Column({ length: 220, nullable: true })
  description: string;

  @Column({ length: 8, nullable: true })
  numberPlate: string;

  @Column({ type: 'decimal', precision: 11, scale: 2 })
  fuelCapacity: number;

  @Column({
    type: 'enum',
    enum: TruckStatus,
    default: TruckStatus.Inactive,
  })
  status: TruckStatus;

  @CreateDateColumn()
  created: Date;

  @UpdateDateColumn()
  updated: Date;
}
