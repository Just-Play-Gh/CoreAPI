import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  BaseEntity,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'callbacks', schema: 'public' })
export class Tax extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 18 })
  invoiceNumber: string;

  @Column({ type: 'json' })
  callback: JSON;

  @CreateDateColumn()
  created: Date;

  @UpdateDateColumn()
  updated: Date;
}
