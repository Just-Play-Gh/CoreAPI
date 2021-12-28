import { Customer } from 'src/customer/entities/customer.entity';
import { Driver } from 'src/driver/entities/driver.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  BaseEntity,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
  OneToOne,
  JoinColumn,
  ManyToOne,
} from 'typeorm';

export enum OrderStatusType {
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
  @Column()
  customerId: string;

  @Index('drivId-idx')
  @Column()
  driverId: string;

  @Column({ length: '55' })
  latlong: string;

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

  @ManyToOne(() => Driver, (driver) => driver.id)
  driver: Driver;

  @ManyToOne(() => Customer, (customer) => customer.id)
  customer: Customer;

  async isPending() {
    return this.status === OrderStatusType.Pending;
  }
  async hasBeenAssigned() {
    return this.driverId !== null;
  }
}
