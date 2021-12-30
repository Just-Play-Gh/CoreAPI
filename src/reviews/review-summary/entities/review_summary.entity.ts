import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  BaseEntity,
  CreateDateColumn,
  Index,
  UpdateDateColumn,
} from 'typeorm';

export enum ReviewType {
  Customer = 'customer',
  Driver = 'driver',
}

@Entity({ name: 'review_summaries', schema: 'public' })
export class ReviewSummary extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Index('sum-custId-idx')
  @Column({ length: 11 })
  customerId: string;

  @Index('sum-drivId-idx')
  @Column({ length: 11, nullable: true })
  driverId: string;

  @Index('sum-inv-idx')
  @Column({ length: 11, nullable: true })
  invoiceId: string;

  @Column()
  totalCount: number;

  @Column({ type: 'double' })
  rating: number;

  @Column()
  totalStars: number;

  @CreateDateColumn()
  created: Date;

  @UpdateDateColumn()
  updated: Date;
}
