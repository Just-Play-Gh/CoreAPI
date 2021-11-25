import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  BaseEntity,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';

enum InvoiceStatusType {
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
  @Column({ length: 18 })
  invoiceNumber: string;

  @Column({ type: 'double', precision: 6, scale: 3 })
  pricePerLitre: number;

  @Column({ type: 'double', precision: 18, scale: 2 })
  totalAmount: number;

  @Column({ type: 'json' })
  taxes: JSON;

  @Index('status-idx')
  @Column({
    type: 'enum',
    enum: InvoiceStatusType,
    default: InvoiceStatusType.Pending,
  })
  status: InvoiceStatusType;

  @Column({ length: 100 })
  customerFullName: string;

  @Column({ length: 15 })
  channel: string;

  @Index('transId-idx')
  @Column({ length: 40 })
  channelTransactionId: string;

  @Index('custNumber-idx')
  @Column({ length: 15 })
  customerPhoneNumber: string;

  @CreateDateColumn()
  created: Date;

  @UpdateDateColumn()
  updated: Date;
}
