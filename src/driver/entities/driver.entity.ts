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

enum DriverStatusType {
  Offline = 'offline',
  Online = 'online',
  Busy = 'busy',
  Active = 'active',
  Inactive = 'inactive',
}

@Entity({ name: 'drivers', schema: 'public' })
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 50 })
  firstName: string;

  @Column({ length: 50 })
  lastName: string;

  @Column({ length: 90, nullable: true })
  email: string;

  @Column({ length: 15, unique: true })
  phoneNumber: string;

  @Column({ type: 'date' })
  dateOfBirth: Date;

  @Column({ length: 180 })
  address: string;

  @Column({ length: 16 })
  licenseNumber: string;

  @Column()
  @Exclude()
  password: string;

  @Index('status-idx')
  @Column({
    type: 'enum',
    enum: DriverStatusType,
    default: DriverStatusType.Active,
  })
  status: DriverStatusType;

  @CreateDateColumn()
  created: Date;

  @UpdateDateColumn()
  updated: Date;

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
