import dayjs from 'dayjs';
import { Customer } from 'src/customer/entities/customer.entity';
import { Driver } from 'src/driver/entities/driver.entity';
import { Product } from 'src/product/entities/product.entity';
// import { Tax } from 'src/tax/entities/tax.entity';
import {
  Entity,
  Column,
  BaseEntity,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
  ManyToOne,
  BeforeInsert,
  PrimaryColumn,
  OneToMany,
} from 'typeorm';
import { OrderDevice } from './order-devices.entity';
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
  @PrimaryColumn()
  id: string;

  @Column({ type: 'double', precision: 6, scale: 3 })
  pricePerLitre: number;

  @Column({ type: 'double', precision: 18, scale: 2, default: 0.0 })
  totalAmount: number;

  @Column({ type: 'double', precision: 18, scale: 2, default: 0.0 })
  surcharge: number;

  @Column({ type: 'double', precision: 5, scale: 2, default: 0 })
  surchargeRate: number;

  @Column({ type: 'double', precision: 5, scale: 2 })
  surchargeThresholdInLitres: number;

  // @Column({ type: 'double', precision: 18, scale: 2, nullable: true })
  // litres: number;

  @Column({ type: 'double', precision: 18, scale: 2, nullable: true })
  totalLitres: number;

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
  @Index('prod-idx')
  productId: number;

  @Index('device-idx')
  @Column({ nullable: true })
  device: string;

  @Index('status-idx')
  @Column({
    type: 'enum',
    enum: OrderStatusType,
    default: OrderStatusType.Pending,
  })
  status: OrderStatusType;

  @Column({ default: 0 })
  devicesCount: number;

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

  @OneToMany(() => OrderDevice, (device) => device.order)
  devices: OrderDevice[];

  @ManyToOne(() => Customer, (customer) => customer.id)
  customer: Customer;

  @ManyToOne(() => Product, (product) => product.id)
  product: Product;

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
  async isCompleted() {
    return this.status === OrderStatusType.Completed;
  }
  async isCancelled() {
    return this.status === OrderStatusType.Cancelled;
  }
  async isNotAccepted() {
    return this.status === OrderStatusType.NotAccepted;
  }
  async hasBeenAssigned() {
    return this.driverId !== null;
  }
  async createLog(message, name = '') {
    return OrderLog.create({
      orderId: this.id,
      message: message,
      name: name,
    }).save();
  }
  @BeforeInsert()
  insertOrderDate() {
    this.orderDate = dayjs().format('YYYY-MM-DD');
  }
}
