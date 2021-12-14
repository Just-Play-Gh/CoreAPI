import { Driver } from '../../../driver/entities/driver.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  BaseEntity,
  CreateDateColumn,
  ManyToOne,
} from 'typeorm';

@Entity({ name: 'driver_ratings', schema: 'public' })
export class DriverRatings extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Driver, (driver) => driver.id)
  driver: Driver;

  @Column({ type: 'int' })
  star: number;

  @CreateDateColumn()
  created: Date;
}
