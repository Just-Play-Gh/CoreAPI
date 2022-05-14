import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  BaseEntity,
  CreateDateColumn,
  Index,
  UpdateDateColumn,
  BeforeInsert,
} from 'typeorm';
import dayjs from 'dayjs';

export enum ReviewType {
  Customer = 'customer',
  Driver = 'driver',
}

@Entity({ name: 'reviews', schema: 'public' })
export class Review extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Index('custId-idx')
  @Column({ length: 11 })
  customerId: string;

  @Index('drivId-idx')
  @Column({ length: 11 })
  driverId: string;

  @Index('order-idx')
  @Column({ length: 20, nullable: true })
  orderId: string;

  @Column({ type: 'text', nullable: true })
  customerReview: string;

  @Column({ type: 'text', nullable: true })
  driverReview: string;

  @Column()
  stars: number;

  @Column()
  createdDate: string;

  @CreateDateColumn()
  created: Date;

  @UpdateDateColumn()
  updated: Date;

  @BeforeInsert()
  getDate() {
    this.createdDate = dayjs().format('YYYY-MM-DD');
  }
}
