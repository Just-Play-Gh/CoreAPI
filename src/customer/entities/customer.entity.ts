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
} from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Exclude } from 'class-transformer';

export enum ProviderType {
  Default = 'default',
  Google = 'google',
  Apple = 'apple',
}

@Entity({ name: 'customers', schema: 'public' })
export class Customer extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 50 })
  firstName: string;

  @Column({ length: 50 })
  lastName: string;

  @Column({ length: 90, unique: true })
  email: string;

  @Index('provider-idx')
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
  @Column({ length: 15, unique: true })
  phoneNumber: string;

  @Column()
  @Exclude()
  password: string;

  @Column()
  status: boolean;

  @CreateDateColumn()
  created: Date;

  @UpdateDateColumn()
  updated: Date;

  @Index('email-verify-idx')
  @Column({ nullable: true })
  emailVerifiedAt: Date;

  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword(): Promise<void> {
    if (this.password) {
      this.password = await bcrypt.hash(this.password, 8);
    }
  }

  async validatePassword(password: string): Promise<boolean> {
    return await bcrypt.compare(password, this.password);
  }
}
