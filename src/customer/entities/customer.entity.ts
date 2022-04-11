import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  BaseEntity,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
  OneToMany,
  OneToOne,
  JoinColumn,
  DeleteDateColumn,
} from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Exclude } from 'class-transformer';
import { Order } from 'src/order/entities/order.entity';
import { ReviewSummary } from 'src/reviews/review-summary/entities/review_summary.entity';

export enum ProviderType {
  Default = 'default',
  Google = 'google',
  Apple = 'apple',
}

export enum UserStatusType {
  Active = 'active',
  Disable = 'disable',
}

@Entity({ name: 'customers', schema: 'public' })
export class Customer extends BaseEntity {
  protected hidden = ['password'];

  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 50 })
  firstName: string;

  @Column({ length: 50 })
  lastName: string;

  @Column({ length: 90, unique: true, nullable: true })
  email: string;

  @Index('provider-typex')
  @Column({
    type: 'enum',
    enum: ProviderType,
    default: ProviderType.Default,
  })
  provider: ProviderType;

  @Index('provider-idx')
  @Column({ length: 150, nullable: true })
  providerId: string;

  @Index('phone-number-idx')
  @Column({ length: 15, unique: true, nullable: true })
  phoneNumber: string;

  @Index('country-idx')
  @Column({ length: 56, nullable: true })
  country: string;

  @Column({ length: 30, nullable: true })
  referralCode: string;

  @Column({ nullable: true })
  @Exclude()
  password: string;

  @Index('status-typex')
  @Column({
    type: 'enum',
    enum: UserStatusType,
    default: UserStatusType.Active,
  })
  status: UserStatusType;

  @CreateDateColumn()
  created: Date;

  @UpdateDateColumn()
  updated: Date;

  @DeleteDateColumn()
  deleted: Date;

  @Index('email-verify-idx')
  @Column({ nullable: true })
  emailVerifiedAt: Date;

  async validatePassword(password: string): Promise<boolean> {
    return await bcrypt.compare(password, this.password);
  }

  async getFullName() {
    return this.firstName + ' ' + this.lastName;
  }

  @OneToOne(() => ReviewSummary, (summary) => summary.customer)
  ratings_summary: ReviewSummary;
}
