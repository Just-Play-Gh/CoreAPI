import { StatusType } from '../../types/index';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  BaseEntity,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';

export enum TaxType {
  Fixed = 'fixed',
  Percentage = 'percentage',
}

@Entity({ name: 'taxes', schema: 'public' })
export class Tax extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'enum',
    enum: TaxType,
    default: TaxType.Percentage,
  })
  type: TaxType;

  @Column({ length: 200, nullable: true })
  description: string;

  @Column({ type: 'decimal', precision: 4, scale: 2 })
  value: number;

  @Index('status-typex')
  @Column({
    type: 'enum',
    enum: StatusType,
    default: StatusType.Active,
  })
  status: StatusType;

  @CreateDateColumn()
  created: Date;

  @UpdateDateColumn()
  updated: Date;
}
