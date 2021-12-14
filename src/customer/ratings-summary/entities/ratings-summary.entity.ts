import { Customer } from '../../../customer/entities/customer.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  BaseEntity,
  CreateDateColumn,
  ManyToOne,
} from 'typeorm';
@Entity({ name: 'customer_ratings_summary', schema: 'public' })
export class CustomerRatingsSummary extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Customer, (customer) => customer.id)
  customer: Customer;

  @Column({ type: 'int' })
  totalStars: number;

  @Column({ type: 'int' })
  totalCount: number;

  @CreateDateColumn()
  date: Date;
}
