import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  BaseEntity,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';

enum OrderStatusType {
  Pending = 'pending',
  Completed = 'completed',
  Cancelled = 'cancelled',
}

@Entity({ name: 'orders', schema: 'public' })
export class Order extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Index('ordersInv-idx')
  @Column({ length: 11 })
  invoiceId: string;

  @Index('custId-idx')
  @Column({ length: 11 })
  customerId: string;

  @Index('drivId-idx')
  @Column({ length: 11 })
  driverId: string;

  @Column({ type: 'double', precision: 18, scale: 2 })
  customerLatitude: number;

  @Column({ type: 'double', precision: 18, scale: 2 })
  customerLongitude: number;

  @Column({ length: 50 })
  customerLocation: string;

  @Index('status-idx')
  @Column({
    type: 'enum',
    enum: OrderStatusType,
    default: OrderStatusType.Pending,
  })
  status: OrderStatusType;

  @CreateDateColumn()
  created: Date;

  @UpdateDateColumn()
  updated: Date;
}
