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
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import * as bcrypt from 'bcrypt';
import { DriverRatingsSummary } from '../ratings-summary/entities/ratings-summary.entity';
import { Exclude } from 'class-transformer';
import { Role } from 'src/role/entity/role.entity';

export enum StatusType {
  Active = '1',
  Inactive = '0',
}

@Entity({ name: 'drivers', schema: 'public' })
export class Driver extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => DriverRatingsSummary, (summary) => summary.driver)
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

  @DeleteDateColumn()
  deleted: Date;

  async validatePassword(password: string): Promise<boolean> {
    return await bcrypt.compare(password, this.password);
  }

  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword(): Promise<void> {
    if (this.password) {
      this.password = await bcrypt.hash(this.password, 8);
    }
  }

  async generateToken() {
    delete this.password;
    return;
  }
}
