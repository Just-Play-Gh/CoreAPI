import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  BaseEntity,
  CreateDateColumn,
  DeleteDateColumn,
  Index,
  UpdateDateColumn,
} from 'typeorm';

export enum GeofenceStatus {
  Active = 'active',
  Inactive = 'inactive',
}

@Entity({ name: 'geofences', schema: 'public' })
export class Geofence extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 50 })
  name: string;

  @Column({ length: 220 })
  description: string;

  @Column({ length: 40 })
  focusPoint: string;

  @Column({ type: 'double', precision: 18, scale: 2 })
  radius: number;

  @Index('geo-status-idx')
  @Column({
    type: 'enum',
    enum: GeofenceStatus,
    default: GeofenceStatus.Inactive,
  })
  status: GeofenceStatus;

  @CreateDateColumn()
  created: Date;

  @UpdateDateColumn()
  updated: Date;

  @DeleteDateColumn()
  deleted: Date;
}
