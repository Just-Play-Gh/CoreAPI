import {
  BaseEntity,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';

export enum DeviceType {
  Vehicle = 'vehicle',
  Generator = 'generator',
  HeavyDuty = 'heavy_duty',
}

@Entity({ name: 'device_groups', schema: 'public' })
@Unique('group-devcice-inique', ['groupId', 'deviceId'])
export class DeviceGroup extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  groupId: number;

  @Column()
  deviceId: number;

  @CreateDateColumn()
  created: Date;
}
