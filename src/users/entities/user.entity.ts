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
  ManyToOne,
  JoinColumn,
} from 'typeorm';

@Entity({ name: 'users', schema: 'public' })
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 50, nullable: true })
  firstName: string;

  @Column({ length: 50, nullable: true })
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

  @Column({ length: 50 })
  role: string;

  @ManyToOne(() => Role, (role) => role.user)
  @JoinColumn({ name: 'roleId', referencedColumnName: 'id' })
  roles: Role;

  @CreateDateColumn()
  created: Date;

  @Column({ type: 'timestamp', nullable: true })
  lastLogin: Date;

  @UpdateDateColumn()
  updated: Date;

  @DeleteDateColumn()
  deleted: Date;

  @Index('email-verify-idx')
  @Column({ nullable: true })
  emailVerifiedAt: Date;
}
