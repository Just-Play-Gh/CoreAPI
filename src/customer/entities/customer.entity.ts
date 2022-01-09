import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  BaseEntity,
  CreateDateColumn,
  UpdateDateColumn,
  BeforeInsert,
  BeforeUpdate,
  Index,
  OneToMany,
  OneToOne,
} from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Exclude } from 'class-transformer';
import { Order } from 'src/order/entities/order.entity';
import { ReviewSummary } from 'src/reviews/review-summary/entities/review_summary.entity';
import { generatePassword } from 'src/helpers/generator';

export enum ProviderType {
  Default = 'default',
  Google = 'google',
  Apple = 'apple',
}

export enum StatusType {
  Active = '1',
  Inactive = '0',
}

@Entity({ name: 'customers', schema: 'public' })
export class Customer extends BaseEntity {
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
    enum: StatusType,
    default: StatusType.Active,
  })
  status: StatusType;

  @CreateDateColumn()
  created: Date;

  @UpdateDateColumn()
  updated: Date;

  @Index('email-verify-idx')
  @Column({ nullable: true })
  emailVerifiedAt: Date;

  @OneToMany(() => Order, (order) => order.driver) // specify inverse side as a second parameter
  orders: Order[];

  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword(): Promise<void> {
    if (this.password) {
      this.password = await bcrypt.hash(this.password, 8);
    }
  }

  @BeforeInsert()
  generateReferralCode() {
    this.referralCode = generatePassword(8).toUpperCase();
  }

  async validatePassword(password: string): Promise<boolean> {
    return await bcrypt.compare(password, this.password);
  }

  async getFullName() {
    return this.firstName + ' ' + this.lastName;
  }
  @OneToOne(() => ReviewSummary, (summary) => summary.customerId)
  ratings_summary: Customer;
}
