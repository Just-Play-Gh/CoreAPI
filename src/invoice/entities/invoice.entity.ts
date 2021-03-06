import { Tax } from '../../tax/entities/tax.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  BaseEntity,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';

export enum InvoiceStatusType {
  Pending = 'pending',
  Processing = 'processing',
  Failed = 'failed',
  Paid = 'paid',
}

@Entity({ name: 'invoices', schema: 'public' })
export class Invoice extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Index('invoice-idx')
  @Column({ length: 20 })
  invoiceNumber: string;

  @Column({ type: 'double', precision: 6, scale: 3 })
  pricePerLitre: number;

  @Column({ type: 'double', precision: 18, scale: 2 })
  totalAmount: number;

  @Column({ type: 'json' })
  taxes: Tax[];

  @Index('status-idx')
  @Column({
    type: 'enum',
    enum: InvoiceStatusType,
    default: InvoiceStatusType.Pending,
  })
  status: InvoiceStatusType;

  @Column({ length: 100 })
  customerFullName: string;

  @Column({ length: 15, nullable: true })
  channel: string;

  @Index('transId-idx')
  @Column({ length: 40, nullable: true })
  channelTransactionId: string;

  @Index('custNumber-idx')
  @Column({ length: 15 })
  customerPhoneNumber: string;

  @CreateDateColumn()
  created: Date;

  @UpdateDateColumn()
  updated: Date;
}
