import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  BaseEntity,
  CreateDateColumn,
  Index,
} from 'typeorm';

export enum ReviewType {
  Customer = 'cutomer',
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
  @Column({ length: 11, nullable: true })
  driverId: string;

  @Index('inv-idx')
  @Column({ length: 11, nullable: true })
  invoiceId: string;

  @Column({ type: 'text' })
  review: string;

  @Column({ type: 'double', precision: 8, scale: 6 })
  customerLongitude: number;

  @Column({ length: 50, nullable: true })
  customerLocation: string;

  @Index('review-type-idx')
  @Column({
    type: 'enum',
    enum: ReviewType,
  })
  reviewType: ReviewType;

  @CreateDateColumn()
  created: Date;
}
