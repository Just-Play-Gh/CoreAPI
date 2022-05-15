import dayjs from 'dayjs';
import { Customer } from 'src/customer/entities/customer.entity';
import { Product } from 'src/product/entities/product.entity';
import {
  Entity,
  Column,
  BaseEntity,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
  ManyToOne,
  BeforeInsert,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Order } from './order.entity';

export enum OrderDeviceStatusType {
  Pending = 'pending',
  Completed = 'completed',
  InProgress = 'in-progress',
  Cancelled = 'cancelled',
}

@Entity({ name: 'orders_devices', schema: 'public' })
export class OrderDevice extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false })
  orderId: string;

  @Column({ type: 'double', precision: 18, scale: 2, default: 0.0 }) // There should be a way to manuall ycpmplete a transaction in case the amount paid is too much for the payement processors like a million
  amount: number;

  @Column({ type: 'double', precision: 18, scale: 2, nullable: true })
  litres: number;

  @Column({ type: 'double', precision: 6, scale: 3 })
  pricePerLitre: number;

  @Index('custId-idx')
  @Column()
  customerId: string;

  @Column({ type: 'int', nullable: true })
  @Index('prod-idx')
  productId: number;

  @Column({ nullable: true })
  @Index('ord-dev-idx')
  deviceId: string;

  @Column({ nullable: true })
  deviceName: string;

  @Index('status-idx')
  @Column({
    type: 'enum',
    enum: OrderDeviceStatusType,
    default: OrderDeviceStatusType.Pending,
  })
  status: OrderDeviceStatusType;

  @CreateDateColumn()
  created: Date;

  @CreateDateColumn()
  orderDate: string;

  @UpdateDateColumn()
  updated: Date;

  @ManyToOne(() => Order, (order) => order.id)
  order: Order;

  @ManyToOne(() => Customer, (customer) => customer.id)
  customer: Customer;

  @ManyToOne(() => Product, (product) => product.id, { eager: true })
  product: Product;

  async cancel() {
    this.status = OrderDeviceStatusType.Cancelled;
    return this.save();
  }
  async complete() {
    this.status = OrderDeviceStatusType.Completed;
    return this.save();
  }
  async isPending() {
    return this.status === OrderDeviceStatusType.Pending;
  }
  async isCompleted() {
    return this.status === OrderDeviceStatusType.Completed;
  }
  async isCancelled() {
    return this.status === OrderDeviceStatusType.Cancelled;
  }
  @BeforeInsert()
  insertOrderDate() {
    this.orderDate = dayjs().format('YYYY-MM-DD');
  }
}
