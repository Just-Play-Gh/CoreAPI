import dayjs from 'dayjs';
import { Customer } from 'src/customer/entities/customer.entity';
import { Driver } from 'src/driver/entities/driver.entity';
import { Tax } from 'src/tax/entities/tax.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  BaseEntity,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
  ManyToOne,
  BeforeInsert,
} from 'typeorm';
import { OrderLog } from './order-logs.entity';

export enum OrderStatusType {
  Pending = 'pending',
  Completed = 'completed',
  InProgress = 'in-progress',
  NotAccepted = 'not-accepted',
  Cancelled = 'cancelled',
}

@Entity({ name: 'orders', schema: 'public' })
export class Order extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Index('invoice-idx')
  @Column({ length: 20 })
  orderId: string;

  @Column({ type: 'double', precision: 6, scale: 3 })
  pricePerLitre: number;

  @Column({ type: 'double', precision: 18, scale: 2 }) // There should be a way to manuall ycpmplete a transaction in case the amount paid is too much for the payement processors like a million
  amount: number;

  @Column({ type: 'double', precision: 18, scale: 2 })
  totalAmount: number;

  @Column({ type: 'double', precision: 18, scale: 2 })
  litres: number;

  @Column({ length: 100 })
  customerFullName: string;

  @Column({ length: 15, nullable: true })
  channel: string;

  @Index('transId-idx')
  @Column({ length: 40, nullable: true })
  channelTransactionId: string;

  @Index('custId-idx')
  @Column()
  customerId: string;

  @Index('drivId-idx')
  @Column({ nullable: true })
  driverId: string;

  @Column()
  latlong: string;

  @Column({ nullable: true })
  address: string;

  @Column({ type: 'int', nullable: true })
  productId: number;

  @Column({ nullable: true })
  device: string;

  @Index('status-idx')
  @Column({
    type: 'enum',
    enum: OrderStatusType,
    default: OrderStatusType.Pending,
  })
  status: OrderStatusType;

  @CreateDateColumn()
  scheduleDate: Date;

  @CreateDateColumn()
  created: Date;

  @CreateDateColumn()
  orderDate: string;

  @UpdateDateColumn()
  updated: Date;

  @ManyToOne(() => Driver, (driver) => driver.id)
  driver: Driver;

  @ManyToOne(() => Customer, (customer) => customer.id)
  customer: Customer;

  async cancel() {
    this.status = OrderStatusType.Cancelled;
    return this.save();
  }
  async complete() {
    this.status = OrderStatusType.Completed;
    return this.save();
  }
  async isPending() {
    return this.status === OrderStatusType.Pending;
  }
  async hasBeenAssigned() {
    return this.driverId !== null;
  }
  async createLog(message) {
    return OrderLog.create({
      orderId: this.id,
      message: message,
    }).save();
  }
  @BeforeInsert()
  insertOrderDate() {
    this.orderDate = dayjs().format('YYYY-MM-DD');
  }
}
