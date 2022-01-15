import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  BaseEntity,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  Index,
} from 'typeorm';

enum TruckStatus {
  Active = 'active',
  Inactive = 'inactive',
}
@Entity({ name: 'trucks', schema: 'public' })
export class Truck extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 60 })
  @Index('truck-name-idx')
  name: string;

  @Column({ length: 220, nullable: true })
  description: string;

  @Column({ length: 12, nullable: true, unique: true })
  numberPlate: string;

  @Column({ type: 'decimal', precision: 11, scale: 2 })
  fuelCapacity: number;

  @Column({ nullable: true })
  driverId: number;

  @Index('truck-status-idx')
  @Column({
    type: 'enum',
    enum: TruckStatus,
    default: TruckStatus.Inactive,
  })
  status: TruckStatus;

  @CreateDateColumn()
  @Index('truck-created-idx')
  created: Date;

  @UpdateDateColumn()
  updated: Date;

  @DeleteDateColumn()
  deleted: Date;
}
