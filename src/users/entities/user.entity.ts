import { StatusType } from 'src/driver/entities/driver.entity';
import { Role } from 'src/role/entity/role.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  BaseEntity,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
  DeleteDateColumn,
  OneToMany,
} from 'typeorm';

@Entity({ name: 'users', schema: 'public' })
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 50 })
  firstName: string;

  @Column({ length: 50 })
  lastName: string;

  @Column({ length: 90, unique: true })
  email: string;

  @Index('phone-number-idx')
  @Column({ length: 15, unique: true, nullable: true })
  phoneNumber: string;

  @Index('status-typex')
  @Column({
    type: 'enum',
    enum: StatusType,
    default: StatusType.Active,
  })
  status: StatusType;

  @Column({ type: 'int', nullable: true })
  roleId: string;

  @OneToMany(() => Role, (role) => role.id) // specify inverse side as a second parameter
  roles: Role;

  @CreateDateColumn()
  created: Date;

  @UpdateDateColumn()
  updated: Date;

  @DeleteDateColumn()
  deleted: Date;

  @Index('email-verify-idx')
  @Column({ nullable: true })
  emailVerifiedAt: Date;
}
