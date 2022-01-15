import { User } from 'src/users/entities/user.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  BaseEntity,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
  ManyToOne,
  DeleteDateColumn,
} from 'typeorm';

export enum MarketingStatus {
  Active = 'active',
  Inactive = 'inactive',
  Expired = 'expired',
}

@Entity({ name: 'marketing', schema: 'public' })
export class MarketingCampaign extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 100 })
  name: string;

  @Column()
  description: string;

  @Column()
  url: string;

  @Index('status-idx')
  @Column({
    type: 'enum',
    enum: MarketingStatus,
    default: MarketingStatus.Inactive,
  })
  status: MarketingStatus;

  @CreateDateColumn()
  scheduleDate: Date;

  @CreateDateColumn()
  expiryDate: Date;

  @CreateDateColumn()
  created: Date;

  @UpdateDateColumn()
  updated: Date;

  @DeleteDateColumn()
  deleted: Date;

  @ManyToOne(() => User, (user) => user.id)
  user: User;

  async end() {
    this.status = MarketingStatus.Expired;
    return this.save();
  }
  async isActive() {
    return this.status === MarketingStatus.Active;
  }
}
