import { Customer } from 'src/customer/entities/customer.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  BaseEntity,
  CreateDateColumn,
  ManyToOne,
} from 'typeorm';
@Entity({ name: 'customer_ratings', schema: 'public' })
export class CustomerRatings extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Customer, (customer) => customer.id)
  customer: Customer;

  @Column({ type: 'int' })
  star: number;

  @CreateDateColumn()
  created: Date;
}
