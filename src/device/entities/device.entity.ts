import {
  BaseEntity,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum DeviceType {
  Vehicle = 'vehicle',
  Generator = 'generator',
  HeavyDuty = 'heavy_duty',
}

@Entity({ name: 'mechanical_devices', schema: 'public' })
export class Device extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  fuelType: string;

  @Column()
  customerId: number;

  @Column()
  alias: string;

  @Column({
    type: 'enum',
    enum: DeviceType,
    default: DeviceType.Vehicle,
  })
  type: DeviceType;

  @CreateDateColumn()
  created: Date;

  @UpdateDateColumn()
  updated: Date;

  @DeleteDateColumn()
  deleted: Date;
}
