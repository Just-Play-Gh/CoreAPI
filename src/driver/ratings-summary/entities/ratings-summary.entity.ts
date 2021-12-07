import { Driver } from 'src/driver/entities/driver.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  BaseEntity,
  CreateDateColumn,
  ManyToOne,
} from 'typeorm';

@Entity({ name: 'driver_ratings_summary', schema: 'public' })
export class DriverRatingsSummary extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Driver, (driver) => driver.id)
  driver: Driver;

  @Column({ type: 'int' })
  totalStars: number;

  @Column({ type: 'int' })
  totalCount: number;

  @CreateDateColumn()
  date: Date;
}
