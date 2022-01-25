import {
  BaseEntity,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Device } from './device.entity';

@Entity({ name: 'groups', schema: 'public' })
export class Group extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 50 })
  name: string;

  @Column({ length: 140, nullable: true })
  description: string;

  @Column()
  customerId: number;

  @CreateDateColumn()
  created: Date;

  @UpdateDateColumn()
  updated: Date;

  @DeleteDateColumn()
  deleted: Date;

  @ManyToMany(() => Device, { cascade: true })
  @JoinTable()
  devices: Device[];
}
