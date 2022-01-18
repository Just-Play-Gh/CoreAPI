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

@Entity({ name: 'groups', schema: 'public' })
export class Group extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ length: 140, nullable: true })
  description: string;

  @Column()
  creatorId: string;

  @CreateDateColumn()
  created: Date;

  @UpdateDateColumn()
  updated: Date;

  @DeleteDateColumn()
  deleted: Date;
}
