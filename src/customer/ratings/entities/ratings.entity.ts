import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  BaseEntity,
  CreateDateColumn,
  ManyToOne,
} from 'typeorm';
import { User } from 'src/customer/user/entities/user.entity';

@Entity({ name: 'customer_ratings', schema: 'public' })
export class CustomerRatings extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.id)
  customer: User;

  @Column({ type: 'int' })
  star: number;

  @CreateDateColumn()
  created: Date;
}
