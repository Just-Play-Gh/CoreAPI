import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  BaseEntity,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';

@Entity({ name: 'user_referral', schema: 'public' })
export class UserReferral extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Index('user_id-referral-inx')
  @Column()
  userId: string;

  @Index('code-referral-inx')
  @Column()
  referralCode: string;

  @Column({ type: 'decimal', precision: 4, scale: 2 })
  amount: number;

  @CreateDateColumn()
  created: Date;

  @UpdateDateColumn()
  updated: Date;
}
