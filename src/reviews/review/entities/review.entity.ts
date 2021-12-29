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
  @Column({ length: 11, nullable: true })
  driverId: string;

  @Index('inv-idx')
  @Column({ length: 11, nullable: true })
  invoiceId: string;

  @Column({ type: 'text' })
  customer_review: string;

  @Column({ type: 'text' })
  driver_review: string;

  @Column()
  created_date: string;

  @CreateDateColumn()
  created: Date;

  @UpdateDateColumn()
  updated: Date;

  @BeforeInsert()
  getDate() {
    this.created_date = new Date().toISOString().slice(0, 10);
  }
}
