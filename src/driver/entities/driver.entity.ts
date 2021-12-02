import {
  BaseEntity,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

enum DriverStatusType {
  Active = 'active',
  Inactive = 'inactive',
}
@Entity({ name: 'drivers', schema: 'public' })
export class Driver extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'enum',
    enum: DriverStatusType,
    default: DriverStatusType.Active,
  })
  @Column({ length: 50 })
  firstName: string;

  @Column({ length: 50 })
  lastName: string;

  @Column({ length: 15 })
  phoneNumber: string;

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

  // @BeforeInsert()
  // @BeforeUpdate()
  // async hashPassword(): Promise<void> {
  //   if (this.password) {
  //     this.password = await bcrypt.hash(this.password, 8);
  //   }
  // }

  // async generatePassword(length: number): Promise<string> {
  //   const tempPassword = Math.random()
  //     .toString(36)
  //     .slice(length || 8);
  //   return tempPassword;
  // }
}
