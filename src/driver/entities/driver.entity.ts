import {
  BaseEntity,
  BeforeInsert,
  BeforeUpdate,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  ManyToMany,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Exclude } from 'class-transformer';
import { Order } from 'src/order/entities/order.entity';
import { ReviewSummary } from 'src/reviews/review-summary/entities/review_summary.entity';

export enum StatusType {
  Active = 'active',
  Disable = 'disable',
  Busy = 'busy',
  Online = 'Online',
  Offline = 'offline',
}

@Entity({ name: 'drivers', schema: 'public' })
export class Driver extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => ReviewSummary, (summary) => summary.driverId)
  ratings_summary: Driver;

  @Index('status-typex')
  @Column({
    type: 'enum',
    enum: StatusType,
    default: StatusType.Active,
  })
  status: StatusType;

  @Column({ length: 50 })
  firstName: string;

  @Column({ length: 50 })
  lastName: string;

  @Column({ length: 15 })
  phoneNumber: string;

  @Exclude()
  @Column()
  password: string;

  @Column({ length: 90 })
  email: string;

  @Column()
  dateOfBirth: Date;

  @Column()
  address: string;

  @Column()
  licenseNumber: string;

  @CreateDateColumn()
  created: Date;

  @UpdateDateColumn()
  updated: Date;

  @Column({ nullable: true })
  verifiedAt: Date;

  @DeleteDateColumn()
  deleted: Date;

  @OneToMany(() => Order, (order) => order.driver) // specify inverse side as a second parameter
  orders: Order[];

  async validatePassword(password: string): Promise<boolean> {
    return await bcrypt.compare(password, this.password);
  }

  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword(): Promise<void> {
    console.log(this);
    if (this.password) {
      this.password = await bcrypt.hash(this.password, 8);
    }
  }

  async generateToken() {
    delete this.password;
    return;
  }
}
