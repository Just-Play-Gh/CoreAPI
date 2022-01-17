import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  BaseEntity,
  CreateDateColumn,
  Index,
} from 'typeorm';

export enum OrderLogEventMessages {
  Created = 'Looking for the closest driver.',
  Accepted = 'A driver has accepted the request and is on their way to you.',
  Assigned = 'A driver has been assigned to your order.',
  Cancelled = 'Order has been cancelled.',
  Completed = 'Order has been completed.',
}
@Entity({ name: 'order_logs', schema: 'public' })
export class OrderLog extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Index('orderLogsInv-idx')
  @Column()
  orderId: number;

  @Column({ length: 280 })
  message: string;

  @CreateDateColumn()
  created: Date;
}
