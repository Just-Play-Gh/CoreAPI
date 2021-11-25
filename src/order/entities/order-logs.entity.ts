import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  BaseEntity,
  CreateDateColumn,
  Index,
} from 'typeorm';

@Entity({ name: 'order_logs', schema: 'public' })
export class OrderLog extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Index('orderLogsInv-idx')
  @Column({ length: 11 })
  invoiceId: string;

  @Column({ length: 280 })
  message: string;

  @CreateDateColumn()
  created: Date;
}
